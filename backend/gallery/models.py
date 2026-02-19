import os
import uuid

from django.db import models
from django.conf import settings

# Create your models here.

def cover_image_path(instance, filename):
    ext = filename.split('.')[-1]
    filename=f'{uuid.uuid4()}.{ext}'
    return os.path.join('galleries', filename)

class Gallery(models.Model):
    title_en = models.CharField(verbose_name="英語タイトル", max_length=50)
    title_jp = models.CharField(verbose_name="日本語タイトル", max_length=50)
    event_date = models.DateField(verbose_name="イベント開催日")
    cover_image_url = models.ImageField (
        verbose_name="添付画像",
        upload_to=cover_image_path,
    )
    google_photos_url = models.TextField(verbose_name="googleフォトURL")
    created_at = models.DateTimeField(verbose_name="作成日", auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="作成者", related_name="created_gallery" , null=True, blank=True, on_delete=models.SET_NULL)
    def __str__(self):
        return self.title_jp
    class Meta:
        verbose_name = verbose_name_plural = 'アルバム'