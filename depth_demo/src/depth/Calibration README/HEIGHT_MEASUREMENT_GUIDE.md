# Height Measurement Filtering System Guide

## Overview

The height measurement system now supports **two noise filtering methods** to improve accuracy when measuring irregular objects in noisy environments. You can easily switch between methods by changing a single configuration variable.

---

## Configuration (Lines 8-20 in main.py)

```python
# Choose filtering mode: "percentile" or "median_region"
FILTERING_MODE = "percentile"  # Change this to switch methods

# Percentile mode settings
PERCENTILE_MIN = 1   # Use 1st percentile for object top
PERCENTILE_MAX = 99  # Use 99th percentile for table surface

# Median region mode settings
REGION_PERCENT = 5   # Use top/bottom 5% of pixels
```

---

## Method 1: Percentile Filtering

### What It Does
Uses statistical percentiles instead of absolute min/max values to filter out noise.

### How It Works
- **Object Top**: Uses the 1st percentile (ignores the lowest 1% as potential noise)
- **Table Surface**: Uses the 99th percentile (ignores the highest 1% as potential noise)

### When to Use
✅ Light to moderate noise (1-2% of pixels are outliers)  
✅ Random single-pixel noise (sensor errors, dust, reflections)  
✅ Need fast computation  
✅ Object has smooth surfaces  
✅ Most measurements are accurate  

### Configuration
```python
FILTERING_MODE = "percentile"
PERCENTILE_MIN = 1    # Lower = more aggressive filtering on bottom
PERCENTILE_MAX = 99   # Lower = more aggressive filtering on top
```

### Tuning Tips
- **More noise?** → Increase filtering: `PERCENTILE_MIN = 2`, `PERCENTILE_MAX = 98`
- **Less noise?** → Decrease filtering: `PERCENTILE_MIN = 0.5`, `PERCENTILE_MAX = 99.5`
- **Very clean data?** → Minimal filtering: `PERCENTILE_MIN = 0.1`, `PERCENTILE_MAX = 99.9`

### Example Output
```
==================================================
HEIGHT MEASUREMENT - PERCENTILE (1th / 99th)
==================================================
Total valid depth pixels: 28371
Filtering out lowest 1% and highest 1% as noise
--------------------------------------------------
Absolute min (raw):       658.00mm from camera
Object top (filtered):    659.20mm from camera ✓
Absolute max (raw):       742.00mm from camera
Table surface (filtered): 729.50mm from camera ✓
--------------------------------------------------
Height calculated:        70.30mm
Expected:                 70.00mm
Error:                    0.30mm (0.4%)
==================================================
```

---

## Method 2: Median of Regions

### What It Does
Takes the median of the top/bottom N% of pixels instead of single values.

### How It Works
- **Object Top**: Median of the closest 5% of pixels
- **Table Surface**: Median of the furthest 5% of pixels

### When to Use
✅ Heavy or clustered noise (>5% of pixels)  
✅ Noise appears in groups (edge artifacts)  
✅ Textured/bumpy object surfaces  
✅ Need maximum robustness  
✅ Percentile method gives unstable results  

### Configuration
```python
FILTERING_MODE = "median_region"
REGION_PERCENT = 5    # Percentage of pixels to use for median
```

### Tuning Tips
- **More noise or texture?** → Larger region: `REGION_PERCENT = 10`
- **Smoother surfaces?** → Smaller region: `REGION_PERCENT = 3`
- **Very irregular objects?** → Medium region: `REGION_PERCENT = 7`

### Example Output
```
==================================================
HEIGHT MEASUREMENT - MEDIAN OF REGIONS (top/bottom 5%)
==================================================
Total valid depth pixels: 28371
Using median of 1418 pixels from each region
--------------------------------------------------
Absolute min (raw):       658.00mm from camera
Object top (filtered):    660.00mm from camera ✓
Absolute max (raw):       742.00mm from camera
Table surface (filtered): 729.00mm from camera ✓
--------------------------------------------------
Height calculated:        69.00mm
Expected:                 70.00mm
Error:                    -1.00mm (-1.4%)
==================================================
```

---

## Comparison Table

| Feature | Percentile | Median of Regions |
|---------|-----------|-------------------|
| **Speed** | Very Fast | Fast |
| **Noise Handling** | Light-Moderate | Heavy |
| **Texture Handling** | Smooth surfaces | Textured surfaces |
| **Stability** | Good | Excellent |
| **Tuning Complexity** | Simple (1 number) | Simple (1 number) |
| **Best For** | Clean environments | Noisy environments |

---

## How to Switch Methods

### Quick Switch
Just change line 12 in `main.py`:

```python
# For Percentile method:
FILTERING_MODE = "percentile"

# For Median of Regions method:
FILTERING_MODE = "median_region"
```

### Test Both Methods
1. Run with `FILTERING_MODE = "percentile"`
2. Note the height measurement and error
3. Change to `FILTERING_MODE = "median_region"`
4. Compare results
5. Choose the method with lower error and better stability

---

## Troubleshooting

### Problem: Height still inaccurate with Percentile method
**Solution**: Switch to Median of Regions or increase filtering:
```python
PERCENTILE_MIN = 2
PERCENTILE_MAX = 98
```

### Problem: Height varies between frames (e.g., 68mm, 72mm, 69mm)
**Solution**: Use Median of Regions with larger region:
```python
FILTERING_MODE = "median_region"
REGION_PERCENT = 10
```

### Problem: Height consistently too high/low
**Solution**: This is likely not a filtering issue. Check:
- Camera calibration (jeff_test.json)
- Depth filters (spatial, temporal, etc.)
- ROI alignment

### Problem: "Not enough valid depth data" warning
**Solution**: 
- Check if object is in frame
- Verify depth sensor is working
- Check if ROI is correct
- Ensure object is within depth range (0.5m - 1.4m)

---

## Advanced Usage

### Dynamic Mode Switching
You could add logic to automatically choose the best method:

```python
# Calculate noise level
noise_level = (absolute_max - absolute_min) / np.median(sorted_depths)

if noise_level > 0.2:
    # High noise - use robust method
    FILTERING_MODE = "median_region"
else:
    # Low noise - use fast method
    FILTERING_MODE = "percentile"
```

### Adaptive Parameters
Adjust filtering based on object size:

```python
# Larger objects = more pixels = can use tighter filtering
if len(valid_depths) > 50000:
    PERCENTILE_MIN = 0.5
    PERCENTILE_MAX = 99.5
else:
    PERCENTILE_MIN = 2
    PERCENTILE_MAX = 98
```

---

## Recommendations

### For Your Use Case (Irregular Objects, Environmental Noise):

**Start with Percentile (1st/99th)**:
- Fast and effective for most scenarios
- Easy to tune
- Good baseline performance

**Switch to Median of Regions if**:
- You see frame-to-frame variation > 3mm
- Objects have very textured surfaces
- Lighting conditions are unstable
- Multiple objects create complex depth patterns

### Production Settings:

**Clean Environment (warehouse, controlled lighting)**:
```python
FILTERING_MODE = "percentile"
PERCENTILE_MIN = 1
PERCENTILE_MAX = 99
```

**Noisy Environment (outdoor, varying lighting, moving objects)**:
```python
FILTERING_MODE = "median_region"
REGION_PERCENT = 7
```

---

## Performance Notes

- **Percentile method**: ~0.5ms overhead per measurement
- **Median of regions**: ~1ms overhead per measurement
- Both methods are real-time capable at 30fps

---

## Questions?

If you need help choosing the right method or tuning parameters for your specific use case, refer to the comparison table and "When to Use" sections above.

