# this is the dockerfile for fibos docker build

to build fibos image, simply run: 
    ```sh
        docker bulid -t fibos:latest .
    ```<br />
or you can pull the image from docker.io use:
    ```sh
    docker pull wwbweibo/fibos
    ```<br />
to run this image, please use: 
	```docker run -itd -p 8888:8888 -p 9876:9876 --name fibos -v [your_workdir]:/app/fibos wwbweibo/fibos(if you pull the image from docker.io)/fibos(if you build the image by yourself)```