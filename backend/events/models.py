import os
import uuid

from django.db import models
from django.conf import settings


def event_image_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('events', filename)

class Events(models.Model):
    title_en = models.CharField(verbose_name="英語タイトル", max_length=50)
    title_jp = models.CharField(verbose_name="日本語タイトル", max_length=50)
    description_en = models.TextField(verbose_name="英語詳細")
    description_jp = models.TextField(verbose_name="日本語詳細")
    location = models.CharField(verbose_name="場所", max_length=50)
    date = models.DateField(verbose_name="開催日")
    start_time = models.TimeField(verbose_name="開始時刻")
    end_time = models.TimeField(verbose_name="終了時刻")
    cover_image = models.ImageField(
        verbose_name="添付画像",
        upload_to=event_image_path,
        null=True,
        blank=True
    )
    google_form_url = models.TextField(verbose_name="グーグルフォームURL", null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="作成者", related_name="created_events", null=True, blank=True, on_delete=models.SET_NULL)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="更新者", related_name="updated_events", null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(verbose_name="作成日", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="更新日", auto_now=True)

    def __str__(self):
        return self.title_jp

    class Meta:
        verbose_name = verbose_name_plural = 'イベント詳細'

