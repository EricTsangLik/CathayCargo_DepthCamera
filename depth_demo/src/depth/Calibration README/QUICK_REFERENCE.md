# Height Measurement - Quick Reference Card

## 🎯 How to Switch Methods

**Edit line 12 in `main.py`:**

```python
FILTERING_MODE = "percentile"       # Method 1: Fast, good for clean data
FILTERING_MODE = "median_region"    # Method 2: Robust, good for noisy data
```

---

## 📊 Method Comparison

| | **Percentile** | **Median of Regions** |
|---|---|---|
| **Best for** | Clean environments | Noisy environments |
| **Noise tolerance** | Light (1-2%) | Heavy (>5%) |
| **Speed** | Fastest | Fast |
| **Surface type** | Smooth objects | Textured objects |

---

## ⚙️ Quick Tuning

### Percentile Method (Line 15-16)
```python
PERCENTILE_MIN = 1    # 1 = normal, 2 = more filtering, 0.5 = less filtering
PERCENTILE_MAX = 99   # 99 = normal, 98 = more filtering, 99.5 = less filtering
```

### Median Region Method (Line 19)
```python
REGION_PERCENT = 5    # 5 = normal, 10 = more stable, 3 = more precise
```

---

## 🔍 What You'll See

### Percentile Output Example
```
HEIGHT MEASUREMENT - PERCENTILE (1th / 99th)
Absolute min (raw):       658.00mm
Object top (filtered):    659.20mm ✓
Absolute max (raw):       742.00mm
Table surface (filtered): 729.50mm ✓
Height calculated:        70.30mm
Error:                    0.30mm (0.4%)
```

### Median Region Output Example
```
HEIGHT MEASUREMENT - MEDIAN OF REGIONS (top/bottom 5%)
Using median of 1418 pixels from each region
Object top (filtered):    660.00mm ✓
Table surface (filtered): 729.00mm ✓
Height calculated:        69.00mm
Error:                    -1.00mm (-1.4%)
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Height varies ±5mm between frames | Use `median_region` with `REGION_PERCENT = 10` |
| Height consistently wrong | Not a filtering issue - check calibration |
| Too sensitive to noise | Increase `PERCENTILE_MIN` to 2, decrease `PERCENTILE_MAX` to 98 |
| Measurements too smooth | Use `percentile` with `PERCENTILE_MIN = 0.5`, `PERCENTILE_MAX = 99.5` |

---

## ✅ Recommended Settings

### Default (Start Here)
```python
FILTERING_MODE = "percentile"
PERCENTILE_MIN = 1
PERCENTILE_MAX = 99
```

### High Noise Environment
```python
FILTERING_MODE = "median_region"
REGION_PERCENT = 7
```

### Maximum Precision (Low Noise)
```python
FILTERING_MODE = "percentile"
PERCENTILE_MIN = 0.5
PERCENTILE_MAX = 99.5
```

---

## 📈 Decision Tree

```
Is height measurement stable (error < ±2mm)?
├─ YES → Keep current settings ✓
└─ NO → Does height vary ±5mm between frames?
    ├─ YES → Switch to median_region
    │         or increase REGION_PERCENT
    └─ NO → Height consistently wrong?
            └─ Check calibration/filters, not filtering method
```

