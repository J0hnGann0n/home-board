from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required
def board(request):
    return render(request, 'board/board.html', locals())