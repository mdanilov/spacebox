cd ..
node ..\node_modules\bower\bin\bower install
cd tools
call cordova create finder ru.gofinder.app Finder
rd /s /q finder\www
mkdir finder\www
copy config.xml finder\config.xml
cd finder
call cordova platform add android
call cordova plugin add org.apache.cordova.console org.apache.cordova.device org.apache.cordova.inappbrowser org.apache.cordova.geolocation
cd ..
cd ..
cd ..
call npm install
cd public
node ..\node_modules\gulp\bin\gulp build --cordova --server_url="http://spacebox.herokuapp.com" 

mkdir tools\finder\www\lib
xcopy lib tools\finder\www\lib /s /e /y

copy tools\Finder.java tools\finder\platforms\android\src\ru\gofinder\app\Finder.java
copy index.html tools\finder\www\index.html 
copy app.manifest tools\finder\www\app.manifest 

mkdir tools\finder\www\src\js
copy src\js\main.js tools\finder\www\src\js\main.js 

mkdir tools\finder\www\src\js\app\templates
xcopy src\js\app\templates tools\finder\www\src\js\app\templates /s /e /y

mkdir tools\finder\www\src\img
xcopy src\img tools\finder\www\src\img /s /e /y

mkdir tools\finder\www\dist
copy dist\spacebox.js tools\finder\www\dist\spacebox.js
copy dist\spacebox.min.js tools\finder\www\dist\spacebox.min.js
copy dist\spacebox.css tools\finder\www\dist\spacebox.css
copy dist\spacebox.min.css tools\finder\www\dist\spacebox.min.css

copy tools\android\icon48.png tools\finder\platforms\android\res\drawable\icon.png
copy tools\android\icon72.png tools\finder\platforms\android\res\drawable-hdpi\icon.png
copy tools\android\icon36.png tools\finder\platforms\android\res\drawable-ldpi\icon.png
copy tools\android\icon48.png tools\finder\platforms\android\res\drawable-mdpi\icon.png
copy tools\android\icon96.png tools\finder\platforms\android\res\drawable-xhdpi\icon.png

cd tools\finder
call cordova run android
exit 
call cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ..\my-release-key.keystore platforms\android\ant-build\Finder-release-unsigned.apk alias_name
rm platforms\android\ant-build\Finder.apk
zipalign -v 4 platforms\android\ant-build\Finder-release-unsigned.apk platforms\android\ant-build\Finder.apk
