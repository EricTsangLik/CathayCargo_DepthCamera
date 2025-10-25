"""
RANSAC-inspired height measurement approach (backup method)
Use this if the histogram mode method doesn't achieve sufficient accuracy
"""

import numpy as np


def measure_height_ransac(depth_area, depth_scale):
    """
    RANSAC-inspired approach to find table surface and calculate object height.
    
    This method finds the largest cluster of similar depth values in the far range,
    which represents the flat table surface. It's more robust to outliers than
    simple max/percentile methods.
    
    Args:
        depth_area: numpy array of depth values (raw, not scaled)
        depth_scale: depth scale factor to convert to meters
        
    Returns:
        height_mm: measured height in millimeters
        table_depth: detected table depth in meters
        object_top: detected object top depth in meters
    """
    
    # Filter out zero/invalid depths
    valid_depths = depth_area[depth_area > 0] * depth_scale
    
    if len(valid_depths) == 0:
        return None, None, None
    
    # Get sorted depths
    sorted_depths = np.sort(valid_depths)
    
    # Focus on the furthest 25% of depths (where table should be)
    far_threshold_idx = int(len(sorted_depths) * 0.75)
    far_depths = sorted_depths[far_threshold_idx:]
    
    # RANSAC-inspired: Find the largest cluster of similar depths
    max_cluster_size = 0
    table_depth = far_depths[-1]
    tolerance = 0.002  # 2mm tolerance for clustering
    
    # Sample every Nth point to speed up (adaptive sampling)
    sample_step = max(1, len(far_depths) // 100)
    
    for candidate_depth in far_depths[::sample_step]:
        # Count how many depths are within tolerance of this candidate
        cluster = far_depths[np.abs(far_depths - candidate_depth) < tolerance]
        
        if len(cluster) > max_cluster_size:
            max_cluster_size = len(cluster)
            # Use mean of cluster for robustness
            table_depth = np.mean(cluster)
    
    # Get object top (minimum depth = closest point = highest point)
    object_top = np.min(valid_depths)
    
    # Calculate maximum height
    height_mm = (table_depth - object_top) * 1000
    
    return height_mm, table_depth, object_top, max_cluster_size


def debug_print_ransac(height_mm, table_depth, object_top, cluster_size, total_pixels):
    """Print debug information for RANSAC method"""
    print(f"\n=== RANSAC-INSPIRED METHOD ===")
    print(f"Total valid depth pixels: {total_pixels}")
    print(f"Object top (min depth): {object_top*1000:.2f}mm from camera")
    print(f"Table depth (largest cluster): {table_depth*1000:.2f}mm from camera")
    print(f"Cluster size: {cluster_size} pixels")
    print(f"Height calculated: {height_mm:.2f}mm")
    print(f"Expected: 70.00mm")
    print(f"Error: {height_mm - 70:.2f}mm ({(height_mm/70 - 1)*100:.1f}%)")
    print(f"================================\n")

