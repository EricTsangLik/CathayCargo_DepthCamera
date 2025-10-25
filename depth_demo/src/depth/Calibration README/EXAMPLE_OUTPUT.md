# Example Console Output

This document shows what you'll see in the console when running the height measurement system with different modes.

---

## Example 1: Percentile Mode (Default)

**Configuration:**
```python
FILTERING_MODE = "percentile"
PERCENTILE_MIN = 1
PERCENTILE_MAX = 99
```

**Console Output:**
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

**Interpretation:**
- ✅ **Good**: Error is only 0.30mm (0.4%)
- ✅ **Noise filtered**: Raw max was 742mm (outlier), filtered to 729.50mm (accurate)
- ✅ **Minimal filtering**: Only 1% filtered, maintaining precision

---

## Example 2: Median of Regions Mode

**Configuration:**
```python
FILTERING_MODE = "median_region"
REGION_PERCENT = 5
```

**Console Output:**
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

**Interpretation:**
- ✅ **Good**: Error is -1.00mm (-1.4%)
- ✅ **Very robust**: Uses median of 1,418 pixels (not just one value)
- ✅ **Noise filtered**: Same raw outlier (742mm) filtered to 729mm
- ℹ️ **Note**: Slightly more conservative than percentile method

---

## Example 3: High Noise Environment

**Scenario:** Multiple objects, varying lighting, dust particles

**Configuration:**
```python
FILTERING_MODE = "median_region"
REGION_PERCENT = 10
```

**Console Output:**
```
==================================================
HEIGHT MEASUREMENT - MEDIAN OF REGIONS (top/bottom 10%)
==================================================
Total valid depth pixels: 28371
Using median of 2837 pixels from each region
--------------------------------------------------
Absolute min (raw):       655.00mm from camera
Object top (filtered):    661.00mm from camera ✓
Absolute max (raw):       758.00mm from camera
Table surface (filtered): 730.00mm from camera ✓
--------------------------------------------------
Height calculated:        69.00mm
Expected:                 70.00mm
Error:                    -1.00mm (-1.4%)
==================================================
```

**Interpretation:**
- ✅ **Excellent noise filtering**: Raw values show extreme outliers (655mm, 758mm)
- ✅ **Stable result**: Despite noisy data, height is accurate
- ✅ **Large region**: Using 10% (2,837 pixels) provides strong consensus
- ✅ **Robust**: 28mm of noise in raw max filtered down to reasonable value

---

## Example 4: Aggressive Percentile Filtering

**Scenario:** Known noisy environment, want fast computation

**Configuration:**
```python
FILTERING_MODE = "percentile"
PERCENTILE_MIN = 2
PERCENTILE_MAX = 98
```

**Console Output:**
```
==================================================
HEIGHT MEASUREMENT - PERCENTILE (2th / 98th)
==================================================
Total valid depth pixels: 28371
Filtering out lowest 2% and highest 2% as noise
--------------------------------------------------
Absolute min (raw):       655.00mm from camera
Object top (filtered):    660.50mm from camera ✓
Absolute max (raw):       758.00mm from camera
Table surface (filtered): 730.20mm from camera ✓
--------------------------------------------------
Height calculated:        69.70mm
Expected:                 70.00mm
Error:                    -0.30mm (-0.4%)
==================================================
```

**Interpretation:**
- ✅ **Very accurate**: Only 0.30mm error
- ✅ **Aggressive filtering**: Filters out 2% on each end (not just 1%)
- ✅ **Fast**: Still uses percentile method (faster than median)
- ✅ **Good for production**: Balanced between speed and robustness

---

## Example 5: Clean Environment - Minimal Filtering

**Scenario:** Controlled warehouse, minimal noise

**Configuration:**
```python
FILTERING_MODE = "percentile"
PERCENTILE_MIN = 0.5
PERCENTILE_MAX = 99.5
```

**Console Output:**
```
==================================================
HEIGHT MEASUREMENT - PERCENTILE (0.5th / 99.5th)
==================================================
Total valid depth pixels: 28371
Filtering out lowest 0.5% and highest 0.5% as noise
--------------------------------------------------
Absolute min (raw):       658.50mm from camera
Object top (filtered):    658.80mm from camera ✓
Absolute max (raw):       729.20mm from camera
Table surface (filtered): 728.90mm from camera ✓
--------------------------------------------------
Height calculated:        70.10mm
Expected:                 70.00mm
Error:                    0.10mm (0.1%)
==================================================
```

**Interpretation:**
- ✅ **Extremely accurate**: Only 0.10mm error (0.1%)
- ✅ **Clean data**: Raw values already very close to filtered
- ✅ **Minimal filtering**: Only 0.5% filtered (maximum precision)
- ✅ **Optimal for clean environments**: Gets the best possible precision

---

## Example 6: Error Case - Not Enough Data

**Scenario:** Object partially out of frame or too far

**Console Output:**
```
Warning: Not enough valid depth data for measurement
```

**Interpretation:**
- ⚠️ **Issue detected**: Less than 100 valid depth pixels
- 🔍 **Check**: 
  - Is object in frame?
  - Is object within depth range (0.5m - 1.4m)?
  - Is ROI correctly positioned?
  - Is depth sensor working?

---

## Comparing Methods Side-by-Side

### Same Object, Same Environment

**Percentile (1/99):**
```
Height calculated: 70.30mm
Error: 0.30mm (0.4%)
```

**Median Region (5%):**
```
Height calculated: 69.00mm
Error: -1.00mm (-1.4%)
```

**Analysis:**
- Both are accurate (< 2mm error)
- Percentile slightly more precise in this case
- Median region more conservative (safer for production)
- Choose based on your tolerance: Need ±0.5mm? Use percentile. Need stability? Use median.

---

## Frame-to-Frame Stability Example

### Unstable (No Filtering)
```
Frame 1: 84.00mm
Frame 2: 82.50mm
Frame 3: 85.20mm
Frame 4: 83.80mm
Std dev: 1.1mm ❌
```

### Stable (Percentile Filtering)
```
Frame 1: 70.30mm
Frame 2: 70.20mm
Frame 3: 70.40mm
Frame 4: 70.30mm
Std dev: 0.08mm ✅
```

### Very Stable (Median Region 10%)
```
Frame 1: 69.00mm
Frame 2: 69.00mm
Frame 3: 69.00mm
Frame 4: 69.00mm
Std dev: 0.00mm ✅✅
```

**Conclusion:** Filtering dramatically improves stability!

---

## Summary of Visual Indicators

When reading the output:

✅ **Green checkmark areas:**
- "Object top (filtered)" - The value actually used for measurement
- "Table surface (filtered)" - The value actually used for measurement

📊 **Raw values for reference:**
- "Absolute min (raw)" - Shows what would happen without filtering
- "Absolute max (raw)" - Shows what would happen without filtering

🎯 **Key metrics:**
- "Height calculated" - The final result
- "Error" - How far from expected (lower is better)
- Percentage error - Relative accuracy

⚠️ **Watch for:**
- Large difference between raw and filtered (indicates noisy data)
- High error percentage (>5%) - may need different filtering or calibration check
- Warnings about insufficient data

