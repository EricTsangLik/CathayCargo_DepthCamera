# Height Measurement Dual-Mode Filtering System

## 🎯 Quick Start

### Change One Line to Switch Methods

Open `main.py` and edit line 12:

```python
FILTERING_MODE = "percentile"       # Fast, good for clean environments
FILTERING_MODE = "median_region"    # Robust, good for noisy environments
```

That's it! Your height measurements will now use the selected filtering method.

---

## 📚 Documentation Files

| File | Purpose | When to Read |
|------|---------|--------------|
| **QUICK_REFERENCE.md** | Fast lookup guide | When you need quick answers |
| **HEIGHT_MEASUREMENT_GUIDE.md** | Complete guide | When you want to understand deeply |
| **EXAMPLE_OUTPUT.md** | Console output examples | When you want to see what to expect |
| **IMPLEMENTATION_SUMMARY.md** | Technical overview | When you want implementation details |
| **README_FILTERING.md** (this file) | Getting started | Start here! |

---

## 🚀 Getting Started

### Step 1: Understand Your Environment

**Do you have a clean, controlled environment?**
- ✅ Indoor warehouse
- ✅ Consistent lighting
- ✅ No dust or particles
- ✅ Objects have smooth surfaces

→ **Start with Percentile mode**

**Do you have a noisy or challenging environment?**
- ✅ Outdoor or semi-outdoor
- ✅ Varying lighting conditions
- ✅ Dust, steam, or particles in air
- ✅ Objects have textured/irregular surfaces

→ **Start with Median of Regions mode**

### Step 2: Configure

Edit `main.py` lines 8-20:

**For Clean Environment:**
```python
FILTERING_MODE = "percentile"
PERCENTILE_MIN = 1
PERCENTILE_MAX = 99
```

**For Noisy Environment:**
```python
FILTERING_MODE = "median_region"
REGION_PERCENT = 5
```

### Step 3: Test

Run your program and observe the console output:

```
==================================================
HEIGHT MEASUREMENT - PERCENTILE (1th / 99th)
==================================================
Height calculated:        70.30mm
Expected:                 70.00mm
Error:                    0.30mm (0.4%)
==================================================
```

### Step 4: Evaluate

**Is the error acceptable?** (< 2mm or < 3%)
- ✅ **YES** → You're done! Keep current settings
- ❌ **NO** → Continue to Step 5

### Step 5: Tune (If Needed)

**Error is small but measurements vary between frames?**
→ Switch to or increase `median_region` filtering

**Error is consistently too high or low?**
→ This is likely a calibration issue, not filtering

**Need more aggressive filtering?**
→ Adjust parameters (see Tuning Guide below)

---

## ⚙️ Tuning Guide

### Percentile Method

```python
FILTERING_MODE = "percentile"
```

| Setting | Light Noise | Medium Noise | Heavy Noise |
|---------|------------|--------------|-------------|
| **PERCENTILE_MIN** | 0.5 | 1 | 2 |
| **PERCENTILE_MAX** | 99.5 | 99 | 98 |
| **Use when** | Clean lab | Normal warehouse | Dusty/outdoor |

### Median of Regions Method

```python
FILTERING_MODE = "median_region"
```

| Setting | Smooth Objects | Normal Objects | Textured Objects |
|---------|---------------|----------------|------------------|
| **REGION_PERCENT** | 3 | 5 | 10 |
| **Use when** | Flat surfaces | Mixed surfaces | Bumpy surfaces |

---

## 📊 Method Comparison

| Aspect | Percentile | Median of Regions |
|--------|-----------|-------------------|
| **Speed** | Fastest ⚡⚡⚡ | Fast ⚡⚡ |
| **Noise tolerance** | Light-Medium 🔇🔇 | Heavy 🔇🔇🔇 |
| **Stability** | Good ✓✓ | Excellent ✓✓✓ |
| **Precision** | High 🎯🎯🎯 | Medium-High 🎯🎯 |
| **Tuning** | Simple (1 value) | Simple (1 value) |
| **CPU usage** | Minimal | Minimal |

---

## 🎓 Understanding the Output

### What Each Line Means

```
==================================================
HEIGHT MEASUREMENT - PERCENTILE (1th / 99th)     ← Which method is active
==================================================
Total valid depth pixels: 28371                   ← How much data we have
Filtering out lowest 1% and highest 1% as noise  ← What's being filtered
--------------------------------------------------
Absolute min (raw):       658.00mm               ← Without filtering
Object top (filtered):    659.20mm ✓             ← What we actually use
Absolute max (raw):       742.00mm               ← Without filtering (outlier!)
Table surface (filtered): 729.50mm ✓             ← What we actually use
--------------------------------------------------
Height calculated:        70.30mm                ← Final result
Expected:                 70.00mm                ← Reference (adjust/remove as needed)
Error:                    0.30mm (0.4%)          ← How accurate
==================================================
```

### Key Indicators

✅ **Small error (<2mm)**: System is working well  
⚠️ **Medium error (2-5mm)**: Consider tuning or switching methods  
❌ **Large error (>5mm)**: Check calibration, not just filtering  

✅ **Raw vs Filtered similar**: Clean data, minimal noise  
⚠️ **Raw vs Filtered different**: Noisy data, filtering is helping  

---

## 🔧 Common Scenarios

### Scenario 1: Everything Works Great
**Symptoms:** Error < 1mm, stable measurements  
**Action:** Nothing! You're done ✅

### Scenario 2: Accurate but Jumpy
**Symptoms:** Average error OK, but varies ±3mm between frames  
**Current:** `FILTERING_MODE = "percentile"`  
**Solution:**
```python
FILTERING_MODE = "median_region"
REGION_PERCENT = 7
```

### Scenario 3: Consistently Off
**Symptoms:** Always 5-10mm too high or too low  
**Problem:** Not a filtering issue  
**Check:**
- Camera calibration (jeff_test.json)
- Depth sensor calibration
- ROI alignment
- Depth filters configuration

### Scenario 4: Good Indoors, Bad Outdoors
**Solution:** Use different settings for different environments
```python
# Indoor settings
FILTERING_MODE = "percentile"
PERCENTILE_MIN = 1

# Outdoor settings
FILTERING_MODE = "median_region"
REGION_PERCENT = 10
```

---

## 📈 Testing Strategy

### Basic Test (5 minutes)
1. Place 70mm object in frame
2. Run program with default settings
3. Check error in console
4. Error < 2mm? ✅ Done!

### Stability Test (10 minutes)
1. Measure same object for 100 frames
2. Record all height values
3. Calculate standard deviation
4. Std dev < 1mm? ✅ Stable!

### Stress Test (30 minutes)
1. Test different object heights (50mm, 70mm, 100mm, 150mm)
2. Test different lighting (bright, dim, changing)
3. Test different positions (center, edge of ROI)
4. Test both filtering methods
5. Choose method with consistently lower error

---

## 🎯 Recommendations by Industry

### **Warehouse/Logistics**
```python
FILTERING_MODE = "percentile"
PERCENTILE_MIN = 1
PERCENTILE_MAX = 99
```
- Fast processing for high throughput
- Clean indoor environment

### **Manufacturing**
```python
FILTERING_MODE = "median_region"
REGION_PERCENT = 5
```
- Handles dust and particles
- Stable measurements for QC

### **Outdoor/Semi-Outdoor**
```python
FILTERING_MODE = "median_region"
REGION_PERCENT = 10
```
- Maximum robustness for varying conditions
- Handles environmental noise

### **Laboratory/Precision**
```python
FILTERING_MODE = "percentile"
PERCENTILE_MIN = 0.5
PERCENTILE_MAX = 99.5
```
- Maximum precision for controlled environment
- Minimal filtering for best accuracy

---

## ❓ FAQ

**Q: Can I use both methods at the same time?**  
A: No, choose one. You can switch anytime by changing one line.

**Q: Which method is "better"?**  
A: Depends on your environment. Percentile is faster, Median is more robust.

**Q: How do I know which to use?**  
A: Start with Percentile. If measurements are jumpy, switch to Median.

**Q: Can I adjust parameters in real-time?**  
A: Parameters are set at startup. To change, edit config and restart.

**Q: Will this work with irregular objects?**  
A: Yes! Both methods handle irregular objects. The filtering is for noise, not object shape.

**Q: Does this affect processing speed?**  
A: Negligible impact. Both methods add <1ms per measurement at 30fps.

**Q: What if I want no filtering?**  
A: Set `PERCENTILE_MIN = 0` and `PERCENTILE_MAX = 100` (but not recommended).

---

## 🆘 Getting Help

1. **Console output unclear?** → Read `EXAMPLE_OUTPUT.md`
2. **Need to tune?** → Read `QUICK_REFERENCE.md`
3. **Want deep understanding?** → Read `HEIGHT_MEASUREMENT_GUIDE.md`
4. **Technical questions?** → Read `IMPLEMENTATION_SUMMARY.md`

---

## ✅ Success Checklist

Before deploying to production:

- [ ] Tested both methods
- [ ] Chose method that gives lowest error
- [ ] Tuned parameters if needed
- [ ] Tested with multiple object types
- [ ] Tested in actual operating conditions
- [ ] Verified stability (std dev < 1mm)
- [ ] Documented chosen settings
- [ ] Trained operators on what to expect

---

## 🎉 You're Ready!

Your height measurement system now has:
- ✅ Dual-mode filtering for flexibility
- ✅ One-line switching between methods
- ✅ Comprehensive debug output
- ✅ Tunable parameters for any scenario
- ✅ Real-time performance
- ✅ Complete documentation

**Next Step:** Run your program and check the console output! 🚀

