# gitart

Fun art with git contributions

#### Demo

![](demo/dark.png)
![](demo/light.png)

#### Generate

```bash
# From npm
npx gitart "dalirnet !" --year 2011 --cpd 1

# From github
npx github:dalirnet/gitart "dalirnet !" --year 2011 --cpd 1

# [--year -y] Year of commit | min 2000 | max 2020 | default 2000
# [--cpd -c] Commit per day | min 1 | max 9 | default 1
```

```bash
# Out
# ✔ Generated "DALIRNET !" at /path/to/dist/GitArt2011
```

#### Publish

```bash
# Change directory
cd /path/to/dist/GitArt2011

# Add remote
git remote add origin https://github.com/user/GitArt2011.git

# Push to remote
git push -u origin main
```
