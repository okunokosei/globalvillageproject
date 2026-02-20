import os
import uuid

from django.db import models
from django.conf import settings

def notice_image_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('notices', filename)

# 親
class NoticeTag(models.Model):
    name = models.CharField(verbose_name="タグ", max_length=50)
    slug = models.CharField(max_length=50)
    color_code = models.CharField(verbose_name="色コード", max_length=7)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = verbose_name_plural = 'お知らせタグ'

# 子供
class Notice(models.Model):
    tag = models.ForeignKey(NoticeTag, verbose_name="タグ", related_name="notices", on_delete=models.PROTECT)
    title_en = models.CharField(verbose_name="英語タイトル", max_length=200)
    title_jp = models.CharField(verbose_name="日本語タイトル", max_length=200)
    body_en = models.TextField(verbose_name="英語本文")
    body_jp = models.TextField(verbose_name="日本語本文")
    image = models.ImageField(
        verbose_name="添付画像",
        upload_to=notice_image_path,
        null=True,
        blank=True
    )
    is_pinned = models.BooleanField(verbose_name="固定フラグ", default=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="作成者", related_name="created_notices", null=True, blank=True, on_delete=models.SET_NULL)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="最終更新者", related_name="updated_notices", null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(verbose_name="作成日", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="更新日", auto_now=True)

    def __str__(self):
        return self.title_jp

    class Meta:
        verbose_name = verbose_name_plural = 'お知らせ'
