# Height Measurement System - Documentation

## Overview

This document describes the height measurement system implementation in `main.py`, including the fixed ground distance calibration and two filtering methods for accurate object height detection.

---

## Recent Changes

### Fixed Ground Distance Implementation

**What Changed:**
- Added `FIXED_GROUND_DISTANCE = 0.730` meters (730mm) as a calibrated constant
- The table surface distance is now fixed at this value instead of being calculated from depth data
- Both filtering methods now work with this fixed ground distance reference

**Why This Improves Accuracy:**
- Eliminates variability in ground plane detection
- Provides consistent reference point across all measurements
- Reduces noise from table surface depth variations
- Based on calibrated measurement from camera to table surface

**Impact:**
- More accurate and repeatable height measurements
- Filtering methods now focus only on finding the object top accurately
- Height calculation: `height = FIXED_GROUND_DISTANCE - object_top`

---

## Configuration

Located at the top of `main.py`:

```python
# ============================================
# HEIGHT MEASUREMENT CONFIGURATION
# ============================================
# Choose filtering mode: "percentile" or "median_region"
FILTERING_MODE = "percentile"  # Change this to switch methods

# Fixed ground distance (table surface) in meters
FIXED_GROUND_DISTANCE = 0.730  # 730mm from camera to table surface

# Percentile mode settings
PERCENTILE_MIN = 1   # Use 1st percentile for object top

# Median region mode settings
REGION_PERCENT = 5   # Use top 5% of pixels for median calculation
# ============================================
```

---

## Filtering Methods

Both methods filter the **object top** measurement while using the fixed ground distance as the reference.

### 1. Percentile Filtering

**How It Works:**
```python
FILTERING_MODE = "percentile"
```
- Sorts all valid depth values from the object region
- Uses the 1st percentile value as the object top
- Filters out the lowest 1% as noise outliers
- More aggressive outlier rejection

**Pros:**
✅ **Excellent noise rejection** - Removes extreme outlier pixels effectively  
✅ **Simple to understand** - Clear statistical meaning  
✅ **Consistent behavior** - Works predictably across different object sizes  
✅ **Good for noisy data** - Handles sensor noise and reflection artifacts well  
✅ **Fast computation** - NumPy percentile is highly optimized  

**Cons:**
❌ **May be too aggressive** - Could filter out valid data in some cases  
❌ **Fixed percentage** - Doesn't adapt to object characteristics  
❌ **Edge sensitivity** - May miss fine details at object edges  

**Best Used For:**
- Objects with smooth, flat tops
- Environments with sensor noise or reflections
- When consistency is more important than precision
- Production environments where reliability matters

---

### 2. Median Region Filtering

**How It Works:**
```python
FILTERING_MODE = "median_region"
```
- Sorts all valid depth values from the object region
- Takes the top 5% (closest pixels to camera)
- Calculates the median of this region
- Uses median value as the object top

**Pros:**
✅ **Robust to outliers** - Median is less affected by extreme values  
✅ **Preserves detail** - Considers a region rather than single percentile  
✅ **Adaptive behavior** - Region size scales with data points  
✅ **Better for irregular surfaces** - Handles textured object tops well  
✅ **Balanced approach** - Good trade-off between noise and accuracy  

**Cons:**
❌ **Slightly more complex** - Requires understanding of region concept  
❌ **Region size matters** - Performance depends on REGION_PERCENT tuning  
❌ **May include noise** - If noise is concentrated in top region  
❌ **Computation overhead** - Slightly slower than percentile (minimal)  

**Best Used For:**
- Objects with textured or irregular tops
- When you want to preserve surface details
- Situations requiring fine-grained measurements
- When object top isn't perfectly flat

---

## Comparison Table

| Feature | Percentile | Median Region |
|---------|-----------|---------------|
| **Noise Rejection** | Excellent | Very Good |
| **Detail Preservation** | Good | Excellent |
| **Computation Speed** | Fastest | Very Fast |
| **Tuning Complexity** | Simple | Moderate |
| **Surface Adaptability** | Fixed | Adaptive |
| **Best For** | Smooth objects | Textured objects |
| **Outlier Handling** | Aggressive | Balanced |

---

## How to Choose

### Use **Percentile Filtering** when:
- Your objects have smooth, flat tops
- You're experiencing sensor noise or reflections
- You need consistent, repeatable measurements
- Performance is critical (though difference is minimal)
- You want simpler configuration

### Use **Median Region Filtering** when:
- Your objects have textured or irregular surfaces
- You need to preserve surface detail
- You're measuring varied object types
- You want more control over the filtering behavior
- You can afford to tune the REGION_PERCENT parameter

---

## Tuning Parameters

### Percentile Mode
```python
PERCENTILE_MIN = 1  # Range: 0-10 recommended
```
- **Lower values (0-2)**: More aggressive filtering, better noise rejection
- **Higher values (3-10)**: More conservative, preserves more data
- **Default (1)**: Good balance for most cases

### Median Region Mode
```python
REGION_PERCENT = 5  # Range: 1-20 recommended
```
- **Lower values (1-3%)**: More selective, uses fewer pixels
- **Higher values (10-20%)**: More inclusive, averages more area
- **Default (5%)**: Good balance for most objects

---

## Technical Details

### Height Calculation Formula
```python
height_mm = (FIXED_GROUND_DISTANCE - object_top) * 1000
```

Where:
- `FIXED_GROUND_DISTANCE` = 0.730m (calibrated table distance)
- `object_top` = filtered depth value (in meters)
- Result in millimeters

### Debug Output
The system prints detailed measurement information:
```
==================================================
HEIGHT MEASUREMENT - PERCENTILE (1th) + FIXED GROUND
==================================================
Total valid depth pixels: 15234
Filtering lowest 1% as noise, using fixed ground at 730.00mm
--------------------------------------------------
Absolute min (raw):       665.32mm from camera
Object top (filtered):    667.89mm from camera ✓
Absolute max (raw):       728.45mm from camera
Table surface (FIXED):    730.00mm from camera ✓
--------------------------------------------------
Height calculated:        62.11mm
Expected:                 70.00mm
Error:                    -7.89mm (-11.3%)
==================================================
```

---

## Calibration

### Fixed Ground Distance
The `FIXED_GROUND_DISTANCE` should be calibrated for your specific setup:

1. **Place a flat reference on the table**
2. **Measure actual distance** from camera to table surface
3. **Update the constant** in the configuration section
4. **Verify with known height objects**

Current calibration: **0.730m (730mm)**

---

## Troubleshooting

### Heights are consistently too high/low
- Re-calibrate `FIXED_GROUND_DISTANCE`
- Verify camera hasn't moved
- Check table surface is level

### Noisy/inconsistent measurements
- Switch to `"percentile"` mode for better noise rejection
- Increase `PERCENTILE_MIN` (2-3) for more aggressive filtering
- Check lighting conditions and object surface properties

### Missing object details
- Switch to `"median_region"` mode
- Increase `REGION_PERCENT` (8-10) to include more data
- Verify object has sufficient depth contrast

### Very small objects not detected
- Check `valid_depths > 100` threshold in code
- Ensure object is large enough in ROI
- Adjust ROI boundaries if needed

---

## Future Improvements

Potential enhancements:
- Automatic mode selection based on object characteristics
- Adaptive parameter tuning based on measurement confidence
- Multi-frame averaging for even more stability
- Confidence scoring for measurement quality
- Additional filtering methods (RANSAC, clustering, etc.)

---

## Version History

### v2.0 (Current)
- Added fixed ground distance (0.730m)
- Implemented percentile filtering method
- Implemented median region filtering method
- Enhanced debug output
- Improved measurement accuracy

### v1.0
- Basic height measurement using min/max depth
- No filtering applied
- Variable ground plane detection

---

## Contact & Support

For questions or issues with the height measurement system, refer to the main project documentation or contact the development team.

---

*Last Updated: October 23, 2025*

