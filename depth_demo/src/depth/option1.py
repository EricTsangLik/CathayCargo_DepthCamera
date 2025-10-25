import base64

import cv2
import numpy as np
import pyrealsense2 as rs
import valkey

def main():
    valkey_client = valkey.Valkey()

    pipeline = rs.pipeline()
    config = rs.config()

    # Get device product line for setting a supporting resolution
    pipeline_wrapper = rs.pipeline_wrapper(pipeline)
    pipeline_profile = config.resolve(pipeline_wrapper)
    device = pipeline_profile.get_device()
    device_product_line = str(device.get_info(rs.camera_info.product_line))

    # if device.is_auto_calibrated_device():
    #     auto_calibrated_dev = rs.auto_calibrated_device(device)
    #     calibration_table = auto_calibrated_dev.get_calibration_table()
    #     # print("Calibration Table:", calibration_table)
    # else:
    #     print("Device does not support auto-calibration.")

    # found_rgb = False
    # for s in device.sensors:
    #     if s.get_info(rs.camera_info.name) == 'RGB Camera':
    #         found_rgb = True
    #         break

    # if not found_rgb:
    #     print("The demo requires Depth camera with Color sensor")
    #     exit(0)
    
    config.enable_stream(rs.stream.depth, 848, 480, rs.format.z16, 30)
    config.enable_stream(rs.stream.color, 848, 480, rs.format.bgr8, 30)

    profile = pipeline.start(config)
    # device = profile.get_device()

    roi_width = 348
    roi_height = 348

    # start_x = 230
    # start_y = 140
    start_x = 254
    start_y = 56
    end_x = start_x + roi_width
    end_y = start_y + roi_height
    
    depth_start_x = start_x
    depth_start_y = start_y
    depth_end_x = depth_start_x + roi_width
    depth_end_y = depth_start_y + roi_height

    with open('jeff_test.json', 'r') as file:
        json_data = file.read()
    
    advanced_mode = rs.rs400_advanced_mode(device)
    advanced_mode.load_json(json_data)

    # Skip 5 first frames to give the Auto-Exposure time to adjust
    for x in range(5):
        pipeline.wait_for_frames()

    depth_sensor = device.first_depth_sensor()

    align_to = rs.stream.color
    align = rs.align(align_to)

    colorizer = rs.colorizer()
    colorizer.set_option(rs.option.color_scheme, 0)
    colorizer.set_option(rs.option.visual_preset, 1)
    colorizer.set_option(rs.option.min_distance, 0.5)
    colorizer.set_option(rs.option.max_distance, 1.4)
    colorizer.set_option(rs.option.histogram_equalization_enabled, 1)
    
    threshold_filter = rs.threshold_filter()
    threshold_filter.set_option(rs.option.min_distance, 0.5)
    threshold_filter.set_option(rs.option.max_distance, 1.4)
    dec_filter = rs.decimation_filter()
    dec_filter.set_option(rs.option.filter_magnitude, 1.0)
    hdr_filter = rs.hdr_merge()
    depth_to_disparity_filter = rs.disparity_transform(True)
    disparity_to_depth_filter = rs.disparity_transform(False)
    spatial_filter = rs.spatial_filter()
    spatial_filter.set_option(rs.option.filter_magnitude, 3.0)
    spatial_filter.set_option(rs.option.filter_smooth_alpha, 0.6)
    spatial_filter.set_option(rs.option.filter_smooth_delta, 30)
    temporal_filter = rs.temporal_filter()
    temporal_filter.set_option(rs.option.filter_smooth_alpha, 0.3)
    temporal_filter.set_option(rs.option.filter_smooth_delta, 21)
    hole_filling_filter = rs.hole_filling_filter(mode=1)


    try:
        while True:
            frames = pipeline.wait_for_frames()

            aligned_frames = align.process(frames)

            depth_frame = aligned_frames.get_depth_frame()
            color_frame = aligned_frames.get_color_frame()
            
            if not depth_frame or not color_frame:
                continue

            # depth_frame = dec_filter.process(depth_frame)
            depth_frame = dec_filter.process(depth_frame)
            depth_frame = hdr_filter.process(depth_frame)
            depth_frame = depth_to_disparity_filter.process(depth_frame)
            depth_frame = spatial_filter.process(depth_frame)
            depth_frame = temporal_filter.process(depth_frame)
            depth_frame = disparity_to_depth_filter.process(depth_frame)
            depth_frame = hole_filling_filter.process(depth_frame)
            depth_frame = threshold_filter.process(depth_frame)
            # depth_frame = colorizer.colorize(depth_frame)

            depth_image = np.asanyarray(depth_frame.get_data())
            color_image_raw = np.asanyarray(color_frame.get_data())

            depth_image = depth_image[start_y:end_y, start_x:end_x]
            color_image = color_image_raw[start_y:end_y, start_x:end_x]
            color_image_copy = color_image.copy()
            
            depth_scale = depth_sensor.get_depth_scale()
            
            # Get camera intrinsics for pixel-to-mm conversion
            intrinsics = color_frame.profile.as_video_stream_profile().intrinsics
            
            find_object_location = depth_image < 722
            object_mask = np.zeros_like(depth_image, dtype=np.uint8)
            object_mask[find_object_location] = 255
            contours, _ = cv2.findContours(object_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            if contours:
                largest_contour = max(contours, key=cv2.contourArea)
                depth_x, depth_y, depth_w, depth_h = cv2.boundingRect(largest_contour)
                
                cv2.rectangle(color_image_copy, (depth_x, depth_y), (depth_x + depth_w, depth_y + depth_h), (0, 255, 0), 2)
                cv2.imshow("Color Image Copy", color_image_copy)

                # double filtering - extract the object from color image
                object_image = color_image[depth_y:depth_y+depth_h, depth_x:depth_x+depth_w]
                gray = cv2.cvtColor(object_image, cv2.COLOR_BGR2GRAY)
                blur = cv2.GaussianBlur(gray, (3, 3), 0)
                thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 5, 2)
                kernel = np.ones((3, 3), np.uint8)
                closing = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=5)
                contours, _ = cv2.findContours(closing, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

                cv2.imshow("Closing", closing)
                
                if contours:
                    largest_contour = max(contours, key=cv2.contourArea)
                    object_x, object_y, object_w, object_h = cv2.boundingRect(largest_contour)
                    
                    cv2.imshow("Object", object_image)

                    # extract the depth area
                    depth_object_x = object_x + depth_x
                    depth_object_y = object_y + depth_y
                    depth_area = depth_image[depth_object_y:depth_object_y+object_h, depth_object_x:depth_object_x+object_w]
                    min_value, max_value, min_location, max_location = cv2.minMaxLoc(depth_area * depth_scale)
                    
                    # Calculate height in mm (existing approach - already correct)
                    height_mm = (max_value - min_value) * 1000
                    
                    # Convert pixel dimensions to real-world dimensions in mm
                    # Use the minimum depth (top of object) as reference point
                    object_depth = min_value  # in meters
                    
                    # Calculate width and length in millimeters using camera intrinsics
                    width_mm = (object_w * object_depth / intrinsics.fx) * 1000
                    length_mm = (object_h * object_depth / intrinsics.fy) * 1000
                    
                    # Store measurements in valkey (now all in mm)
                    valkey_client.set("width", width_mm)
                    valkey_client.set("length", length_mm)
                    valkey_client.set("height", height_mm)
                    
                    # Optional: print for debugging
                    # print(f"Width: {width_mm:.2f} mm, Length: {length_mm:.2f} mm, Height: {height_mm:.2f} mm")
                    # print(f"Volume: {width_mm * length_mm * height_mm:.2f} mm³")

                    # draw rectangle on color image raw with corrected x, y, w, h
                    object_x = object_x + start_x + depth_x
                    object_y = object_y + start_y + depth_y
                    cv2.rectangle(color_image_raw, (object_x, object_y), (object_x + object_w, object_y + object_h), (0, 255, 0), 2)
            

            depth_image = cv2.normalize(depth_image, None, 0, 255, cv2.NORM_MINMAX)
            depth_image = np.uint8(depth_image)

            cv2.imshow("Depth", depth_image)
            cv2.imshow("Color", color_image)
            # cv2.imshow("Contours", closing)
            cv2.imshow("Object Mask", object_mask)
            cv2.imshow("Color Image Raw", color_image_raw)
            return_value, encoded_image = cv2.imencode('.jpg', color_image_raw)
            valkey_client.set("stream_image", base64.b64encode(encoded_image.tobytes()).decode("utf-8"))

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    except Exception as e:
        print(e)
    
    finally:
        pipeline.stop()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()