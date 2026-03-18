from django.http import JsonResponse
from game.models.player.player import Player


def getinfo_acapp(request):
    # 修复：ACAPP 端也加容错，避免数据库为空时报错
    try:
        player = Player.objects.all()[0]
        return JsonResponse({
            'result': "success",
            'username': player.user.username,
            'photo': player.photo,
        })
    except IndexError:
        # 数据库为空时返回友好提示
        return JsonResponse({
            'result': "error",
            'msg': "暂无玩家数据"
        })

def getinfo_web(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': "未登录"
        })
    else:
        # 核心修复：用 get_or_create 替代 get，不存在则自动创建 Player
        player, created = Player.objects.get_or_create(
            user=user,
            defaults={'photo': ''}  # 给 photo 加默认值，避免字段缺失
        )
        return JsonResponse({
            'result': "success",
            'username': player.user.username,
            'photo': player.photo,
        })

def getinfo(request):
    platform = request.GET.get('platform')
    if platform == "ACAPP":
        return getinfo_acapp(request)
    elif platform == "WEB":
        return getinfo_web(request)
    # 补充：未知平台时返回提示
    else:
        return JsonResponse({
            'result': "error",
            'msg': "未知平台类型"
        })