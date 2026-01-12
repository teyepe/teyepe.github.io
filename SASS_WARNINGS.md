# Sass Deprecation Warnings Analysis

**Date:** December 30, 2025  
**Status:** Build Successful with 211+ Deprecation Warnings  
**Impact:** Non-breaking until Dart Sass 2.0/3.0

---

## Executive Summary

The project builds successfully but generates 211+ deprecation warnings from Dart Sass. These warnings indicate that certain Sass features will be removed in future versions (2.0 and 3.0), but **do not currently affect functionality**.

**Recommendation:** Monitor warnings but defer fixes until Dart Sass provides stable automated migration tools.

---

## Warning Categories

### 🔴 CRITICAL - Will Break in Dart Sass 2.0

#### 1. Legacy JS API (1 warning)
```
DEPRECATION WARNING [legacy-js-api]: The legacy JS API is deprecated 
and will be removed in Dart Sass 2.0.0
```

**Issue:** sass-loader v10.1.1 doesn't support the modern `api: 'modern'` option  
**Fix Available:** Upgrade to sass-loader v13+ (requires webpack 5 changes)  
**Effort:** Medium (2-4 hours including testing)  
**Workaround:** Silence with `silenceDeprecations: ['legacy-js-api']` option  
**Timeline:** Dart Sass 2.0 (no release date announced)

#### 2. Slash Division (50+ warnings)
```
DEPRECATION WARNING [slash-div]: Using / for division outside of calc() 
is deprecated and will be removed in Dart Sass 2.0.0.

Recommendation: math.div($a, $b) or calc($a / $b)
```

**Affected Files:**
- `source/assets/css/01_settings/_Settings.scss` (lines 11, 12, 17)
- `source/assets/css/02_tools/_functions.scss` (line 58)
- `source/assets/css/02_tools/_mixins.scss` (line 50)

**Fix:** Replace `$a/$b` with `math.div($a, $b)`  
**Effort:** Low (automated migrator available)  
**Command:** `sass-migrator division source/assets/css/**/*.scss`  
**Risk:** Low (automated tool is reliable)

#### 3. !global Flag (2 warnings)
```
DEPRECATION WARNING [new-global]: As of Dart Sass 2.0.0, !global assignments 
won't be able to declare new variables.
```

**Affected:**
- `source/assets/css/01_settings/_Settings.scss:7` - `$is-printed: false !global;`
- `source/assets/css/01_settings/_Settings.scss:23` - `$font-stack: $sans !global;`

**Fix:** Remove `!global` flag (unnecessary at root level)  
**Effort:** Trivial (2 minutes)  
**Risk:** None

---

### 🟡 HIGH - Will Break in Dart Sass 3.0

#### 4. @import Statements (5+ warnings)
```
DEPRECATION WARNING [import]: Sass @import rules are deprecated 
and will be removed in Dart Sass 3.0.0.
```

**Affected:**
- `source/assets/css/style.scss` (lines 4-8) - All main imports

**Migration Path:** Replace `@import` with `@use` and `@forward`  
**Effort:** High (8-16 hours) - Requires understanding module system  
**Risk:** High - Changes variable/mixin scoping  
**Tool:** `sass-migrator module source/assets/css/**/*.scss`  
**Timeline:** Dart Sass 3.0 (likely 2-3+ years away)

#### 5. Global Built-in Functions (50+ warnings)
```
DEPRECATION WARNING [global-builtin]: Global built-in functions are deprecated 
and will be removed in Dart Sass 3.0.0.

Use color.hue(), color.red(), color.green(), color.blue() instead.
```

**Affected Functions:**
- `hue()` → `color.channel($color, "hue", $space: hsl)`
- `red()` → `color.channel($color, "red", $space: rgb)`
- `green()` → `color.channel($color, "green", $space: rgb)`
- `blue()` → `color.channel($color, "blue", $space: rgb)`
- `function-exists()` → `meta.function-exists()`

**Affected Files:**
- `source/assets/css/02_tools/_functions.scss` (shade-chroma, luminance functions)
- `node_modules/breakpoint-sass/stylesheets/breakpoint/_parsers.scss`

**Fix:** Import `@use 'sass:color'` and `@use 'sass:meta'` at file top  
**Effort:** Medium (4-8 hours)  
**Risk:** Medium - Color calculations must be tested visually

#### 6. Color Function Syntax (50+ warnings)
```
DEPRECATION WARNING [color-functions]: hue() is deprecated.

Suggestion: color.channel($color, "hue", $space: hsl)
```

**Same as #5** - Related to global built-in functions

#### 7. if() Function Syntax (10+ warnings)
```
DEPRECATION WARNING [if-function]: The Sass if() syntax is deprecated 
in favor of the modern CSS syntax.

Suggestion: if(sass($condition): $true; else: $false)
```

**Affected:**
- `source/assets/css/01_settings/_Settings.scss` (lines 9, 11, 12)
- `node_modules/breakpoint-sass/` (external dependency)

**Fix:** Update to new syntax format  
**Effort:** Low (1-2 hours)  
**Risk:** Low

---

### 🟢 MEDIUM - Warnings with No Breaking Timeline

#### 8. Function Units (50+ warnings)
```
DEPRECATION WARNING [function-units]: $weight: Passing a number without unit % (10) 
is deprecated.

To preserve current behavior: $weight * 1%
```

**Affected:**
- `source/assets/css/02_tools/_functions.scss` - `tint()` and `shade()` functions
- Calls: `shade-chroma()` function in multiple files

**Fix:** Change `mix(#FFF, $color, 10)` to `mix(#FFF, $color, 10%)`  
**Effort:** Trivial (5 minutes)  
**Risk:** None

#### 9. Strict Unary (1 warning)
```
DEPRECATION WARNING [strict-unary]: This operation is parsed as: 0 - $sp * 0.2
but you may have intended it to mean: 0 (-$sp * 0.2)

Add a space after - to clarify
```

**Affected:**
- `source/assets/css/04_partials/_footer.scss:35` - `margin: 0 $sp*0.2 0 -$sp*0.2;`

**Fix:** Change to `margin: 0 ($sp*0.2) 0 (-$sp*0.2);`  
**Effort:** Trivial (1 minute)  
**Risk:** None

---

## Actionable Plan

### Phase 1: Quick Wins (30 minutes)
✅ Safe, low-risk fixes that don't affect CSS output

```bash
# 1. Remove unnecessary !global flags (2 minutes)
# Edit source/assets/css/01_settings/_Settings.scss
# Line 7: $is-printed: false !global; → $is-printed: false;
# Line 23: $font-stack: $sans !global; → $font-stack: $sans;

# 2. Fix function units (5 minutes)
# Edit source/assets/css/02_tools/_functions.scss
# tint() function: mix(#FFF, $color, $percentage) → mix(#FFF, $color, $percentage * 1%)
# shade() function: mix(#000, $color, $percentage) → mix(#000, $color, $percentage * 1%)

# 3. Fix strict unary (1 minute)
# Edit source/assets/css/04_partials/_footer.scss:35
# margin: 0 $sp*0.2 0 -$sp*0.2; → margin: 0 ($sp*0.2) 0 (-$sp*0.2);

# 4. Test build
yarn build:prod
```

### Phase 2: Automated Migration (1-2 hours)
⚠️ Requires testing after each step

```bash
# 1. Backup first
git checkout -b sass-migration
git commit -am "Checkpoint before Sass migration"

# 2. Run division migrator
npx sass-migrator division source/assets/css/**/*.scss

# 3. Test build
yarn build:prod

# 4. Visual regression test (manual)
# Open site in browser, check all pages

# 5. If successful, commit
git commit -am "fix(sass): migrate division operators to math.div()"
```

### Phase 3: sass-loader Upgrade (2-4 hours)
⚠️ May require webpack configuration changes

```bash
# 1. Upgrade sass-loader
yarn add sass-loader@^13.0.0 --dev

# 2. Add silenceDeprecations to webpack.config.js
# {
#   loader: 'sass-loader',
#   options: {
#     api: 'modern',
#     silenceDeprecations: ['legacy-js-api'],
#     ...
#   }
# }

# 3. Test build
yarn build:prod
```

### Phase 4: Module System Migration (8-20 hours)
⚠️ **DEFERRED** - High risk, wait for Dart Sass 3.0 announcement

```bash
# When Dart Sass 3.0 release date is announced:
npx sass-migrator module source/assets/css/**/*.scss
# Extensive testing required
```

---

## Silencing Warnings (Temporary)

If warnings become too noisy during development:

```javascript
// webpack.config.js - sass-loader options
{
  loader: 'sass-loader',
  options: {
    // Requires sass-loader v13+
    silenceDeprecations: [
      'legacy-js-api',
      'import',
      'global-builtin',
      'color-functions',
      'slash-div'
    ],
    sourceMap: true,
    sassOptions: {
      includePaths: [...]
    },
    additionalData: '...'
  }
}
```

**Note:** This only hides warnings, doesn't fix the underlying issues.

---

## External Dependencies

Some warnings come from node_modules:

- `breakpoint-sass` - Has if() and function-exists() warnings
- These will need updates from the package maintainer
- Consider switching to modern CSS media queries if package is unmaintained

---

## Timeline & Risk Assessment

| Category | Timeline | Effort | Risk | Priority |
|----------|----------|--------|------|----------|
| !global flags | N/A | 5 min | None | Low |
| function-units | N/A | 10 min | None | Low |
| strict-unary | N/A | 2 min | None | Low |
| slash-div | Dart Sass 2.0 (TBD) | 1-2 hrs | Low | Medium |
| legacy-js-api | Dart Sass 2.0 (TBD) | 2-4 hrs | Low | Medium |
| @import | Dart Sass 3.0 (2-3+ years) | 8-16 hrs | High | Defer |
| color functions | Dart Sass 3.0 (2-3+ years) | 4-8 hrs | Medium | Defer |

---

## Resources

- [Sass Migrator Tool](https://sass-lang.com/documentation/cli/migrator)
- [Dart Sass 2.0 Breaking Changes](https://github.com/sass/dart-sass/blob/main/CHANGELOG.md)
- [Module System Migration Guide](https://sass-lang.com/documentation/at-rules/use)
- [Division Migration Guide](https://sass-lang.com/documentation/breaking-changes/slash-div)

---

## Monitoring

Check for Dart Sass updates:
```bash
npm info sass version  # Current: 1.32.0
```

Subscribe to Sass blog for 2.0/3.0 announcements:
- https://sass-lang.com/blog

---

**Last Updated:** December 30, 2025  
**Next Review:** When Dart Sass 2.0 release date is announced
