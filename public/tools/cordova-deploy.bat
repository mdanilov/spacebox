cd finder
call cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ..\my-release-key.keystore platforms\android\ant-build\Finder-release-unsigned.apk alias_name
rm platforms\android\ant-build\Finder.apk
zipalign -v 4 platforms\android\ant-build\Finder-release-unsigned.apk platforms\android\ant-build\Finder.apk
