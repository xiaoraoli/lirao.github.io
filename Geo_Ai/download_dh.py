import urllib.request, os

OUT = r"E:\other\VR\交互原型\assets"
os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"}

jobs = {
    "dh_brand":    ("https://randomuser.me/api/portraits/women/65.jpg", "dh_brand.jpg"),
    "dh_local":    ("https://randomuser.me/api/portraits/men/41.jpg",   "dh_local.jpg"),
    "dh_teacher":  ("https://randomuser.me/api/portraits/men/52.jpg",   "dh_teacher.jpg"),
    "dh_festival": ("https://randomuser.me/api/portraits/women/90.jpg", "dh_festival.jpg"),
    "dh_beauty":   ("https://randomuser.me/api/portraits/women/33.jpg", "dh_beauty.jpg"),
    "dh_guide":    ("https://randomuser.me/api/portraits/men/86.jpg",   "dh_guide.jpg"),
}

for role, (url, name) in jobs.items():
    dst = os.path.join(OUT, name)
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30) as r, open(dst, "wb") as f:
            f.write(r.read())
        print("OK", name, os.path.getsize(dst), "bytes")
    except Exception as e:
        print("FAIL", name, e)
