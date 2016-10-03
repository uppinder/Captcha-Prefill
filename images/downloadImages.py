import urllib,os
from PIL import Image

i = 9	
download_link = "https://webmail.iitg.ernet.in/plugins/captcha/backends/watercap/image_generator.php?sq=1475095334"
while i>0:
	imageName = str(i) + ".jpg"
	urllib.urlretrieve(download_link,imageName)
	Image.open(imageName).save(str(i)+".png","PNG")
	os.remove(imageName)
	i = i-1