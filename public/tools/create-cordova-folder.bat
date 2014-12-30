cd ..
node ..\node_modules\bower\bin\bower install
cd tools
call cordova create finder ru.gofinder.app Finder
cd finder
call cordova platform add android
call cordova plugin add org.apache.cordova.console org.apache.cordova.device org.apache.cordova.inappbrowser org.apache.cordova.geolocation
cd ..
cd ..
node ..\node_modules\gulp\bin\gulp build
node ..\node_modules\gulp\bin\gulp cordova

mkdir tools\finder\www\fonts
xcopy lib\components-font-awesome\fonts tools\finder\www\fonts /s /e /y
mkdir tools\finder\www\lib\angular
xcopy lib\angular tools\finder\www\lib\angular /s /e /y
mkdir tools\finder\www\lib\yepnope
xcopy lib\yepnope tools\finder\www\lib\yepnope /s /e /y
mkdir tools\finder\www\src\js
xcopy src\js\main.js tools\finder\www\src\js\main.js /s /e /y
mkdir tools\finder\www\src\js\app\templates
xcopy src\js\app\templates tools\finder\www\src\js\app\templates /s /e /y
mkdir tools\finder\www\src\img
xcopy src\img tools\finder\www\src\img /s /e /y

copy dist\spacebox-bundle.js tools\finder\www\js
copy dist\spacebox-bundle.css tools\finder\www\css

cd tools\finder
call cordova run android
exit 
call cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ..\my-release-key.keystore platforms\android\ant-build\Finder-release-unsigned.apk alias_name
rm platforms\android\ant-build\Finder.apk
zipalign -v 4 platforms\android\ant-build\Finder-release-unsigned.apk platforms\android\ant-build\Finder.apk
