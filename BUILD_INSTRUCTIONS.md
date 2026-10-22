# Arabic Wallpapers No Ads — Build Task

Use this repository to build a complete Android application inspired by the user-provided APK `خلفيات عربية(1).apk`.

## Important
The original APK and the starter ZIP are not currently committed in this repository. Before implementation, add the starter project from `ArabicWallpapersNoAds-source.zip` to this repository (extract its contents into the repository root). If the coding agent has access to the uploaded ZIP in its own workspace, extract it directly instead of asking the user to recreate files.

## Task for the coding agent
1. Inspect all source files and assets first.
2. Complete a native Android app for Arabic wallpapers with RTL layout, wallpaper grid, full-screen preview, categories/search where supported, persistent favorites, save-to-device using modern Android APIs, Android share sheet, and offline access to bundled images.
3. Preserve useful existing assets and Arabic fonts where legally reusable. Do not copy proprietary code or bypass licensing, authentication, subscriptions, or paid restrictions.
4. Remove advertising SDKs and ad initialization/code, including AdMob. Keep other dependencies only when needed.
5. Fix Gradle, manifest, resource, and Java/Kotlin errors. Do not leave a mockup or empty interface.
6. Add `.github/workflows/android-build.yml` to build a debug APK on push and manual dispatch, using compatible JDK/Android SDK/Gradle versions.
7. Run the build and tests; fix errors and rerun. Upload `app/build/outputs/apk/debug/app-debug.apk` as a GitHub Actions artifact only after a successful build.
8. Verify the APK exists and is non-empty. Report exactly what was tested and any device testing that was not possible.
9. Commit changes to a dedicated branch when possible. Never commit signing keys, passwords, or API secrets.

## Acceptance criteria
- App builds successfully.
- No advertising SDK or ad display code remains.
- Wallpaper browsing, preview, favorites persistence, save, and share are implemented rather than simulated.
- Offline browsing works for bundled images.
- APK is available as a downloadable GitHub Actions artifact.
- No feature is claimed as verified unless it was actually tested.

Begin by inspecting the repository, then implement and build the app. Do not stop at a plan or documentation-only changes.