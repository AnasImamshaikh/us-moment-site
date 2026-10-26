import json,sys,re
A='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
def sid(c):
    n=0
    for ch in c: n=n*64+A.index(ch)
    return n
r=json.load(open('/tmp/claude-0/-home-claude/693f685e-cecd-53da-97a3-33db074b2646/scratchpad/reels.json'))
files=sys.stdin.read().split()
ids={}
for f in files:
    m=re.search(r'_(\d{15,})_\d+(?:_\d+)?\.(mp4|jpg)$',f)
    if m: ids.setdefault(int(m.group(1)),[]).append(f)
done=[x['code'] for x in r if sid(x['code']) in ids]
todo=[x['code'] for x in r if sid(x['code']) not in ids]
print('done',len(done),'todo',len(todo)); print(' '.join(todo))
