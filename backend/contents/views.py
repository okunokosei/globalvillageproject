from django.shortcuts import render

from rest_framework.permissions import IsAuthenticatedOrReadOnly
from accounts.permissions import IsRoleAdmin

from rest_framework import generics
from .models import Notice, NoticeTag, NoticeImage
from .serializers import NoticeSerializer, NoticeTagSerializer

class NoticeListView(generics.ListCreateAPIView):
    queryset = Notice.objects.all().order_by('-is_pinned', '-created_at')
    serializer_class = NoticeSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticatedOrReadOnly()]
        return [IsRoleAdmin()]

    def perform_create(self, serializer):
        notice = serializer.save(created_by=self.request.user, updated_by=self.request.user)
        # serializer.save()は作成したインスタンス自体を返す。
        images_data = self.request.FILES.getlist('images')
        for image_data in images_data[:3]:
            NoticeImage.objects.create(notice=notice, image=image_data)


class NoticeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticatedOrReadOnly()]
        return [IsRoleAdmin()]
        
    
    def perform_update(self, serializer):
        notice = serializer.save(updated_by=self.request.user)

        deleted_image_ids = self.request.data.getlist('deleted_image_ids')
        if deleted_image_ids:
            NoticeImage.objects.filter(notice=notice, id__in=deleted_image_ids).delete()

        new_images_data = self.request.FILES.getlist('new_images')
        current_image_count = NoticeImage.objects.filter(notice=notice).count()
        available_slots = 3 - current_image_count
        if available_slots > 0:
            for image_data in new_images_data[:available_slots]:
                NoticeImage.objects.create(notice=notice, image=image_data)

class NoticeTagListView(generics.ListAPIView):
    queryset = NoticeTag.objects.all()
    serializer_class = NoticeTagSerializer










# パターン1：完全自動お任せコース（基本形）
# 条件:
# フロントから送られてきたデータと、データベースの形（モデル）が 「完全に1対1」 で一致している場合。
# 書き方:
# Viewには何も書かず、serializer_class = NoticeSerializer とだけ指定する。
# 仕組み:
# 裏側でDRFが勝手に serializer.save() を呼び出して、そのままDBに入れてくれます。

# パターン2：Viewで情報を「ちょい足し」するコース（perform_create）
# 条件:
# フロントからは送られてこないが、「HTTPリクエストを持っているViewしか知らない情報」 を付け足して保存したい場合。
# 具体例:
# 今回の created_by = request.user がまさにこれです。
# なぜSerializerでやらないの？: Serializerはあくまで「データの翻訳係」なので、「今誰がログインしてリクエストを送ってきたか（request）」という通信のコンテキストを持たせないのが美しい設計とされているからです。Viewが request.user を取り出して、serializer.save(created_by=...) とちょい足ししてあげます。

# パターン3：複数のテーブルにまたがる特殊な保存コース
# 条件:
# 送られてきたデータを、「親（Notice）と子（NoticeImage）」のように複数のテーブルに切り分けて保存しなければならない場合。
# 具体例:
# 今回の複数画像アップロードがこれです。
# 仕組み:
# まず親（お知らせ）を保存して、データベース上のID（主キー）を確定させます。
# その確定した親のIDを使って、子（画像）を複数回ループして保存します。
# これを実現するために、Viewの perform_create の中で手動で保存の流れをコントロールしてあげます。



