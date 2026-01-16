from django.http import HttpResponse

def index(request):
    line1 = '<h1 style="text-align: center">明锐作儿</h1>'
    line2 = '<img src="https://i-blog.csdnimg.cn/direct/7b136d0e162945168abe35495557f75a.jpeg" width=1200>'
    line3 = '<hr>'
    line4 = '<a href="/eioeif/">进入诶哦诶服界面</a>'

    return  HttpResponse(line1+line4+line3+line2)

def eioeif(request):
    line1 = '<h1 style="text-align: center">诶哦诶服</h1>'
    line2 = '<a href="/" style="display: block; text-align: center; font-size: 40px;">返回明锐界面</a>'
    line3 = '<img src="https://i-blog.csdnimg.cn/direct/a5a5d614961649eb83d33aaa6b22c827.png" width=1400>'
    return HttpResponse(line1 + line2 + line3)
