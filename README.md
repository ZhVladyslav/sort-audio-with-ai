Config
1. create dit "assets"
2. create dit "audio"

3. move in "audio" files that you want sort
4. create "songs.json" in "assets" with whit structure
```json
{
    "text": "any text",
    "target": "res\\you_path"
},
```

5. run docker with ai
```sh
docker run --rm -p 3000:3000 -d -v "$PWD/audio:/app" get_text_with_audio
```

6. run node js
```sh
node main.js
```