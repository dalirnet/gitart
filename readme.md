# GitArt

Fun art with git contributions [preview](https://github.com/dalirnet?tab=overview&from=2011-12-01&to=2011-12-31)

![light](demo/light.png)

#### Generate

```bash
# From npm
npx gitart "dalirnet !" --year 2011 --cpd 1

# From github
npx github:dalirnet/gitart "dalirnet !" --year 2011 --cpd 1

# [--year -y] Year of commits | min 2000 | max 2020 | default 2000
# [--cpd -c] Commits per day | min 1 | max 9 | default 1
```

```bash
# Out
# ✔ Generated "DALIRNET !" at /path/to/GitArts/GitArt2011
```

#### Publish

```bash
# Change directory
cd /path/to/GitArts/GitArt2011

# Add remote
git remote add origin https://github.com/user/GitArt2011.git

# Push to remote
git push -u origin main
```

![](demo/dark.png)
