from rest_framework import serializers
from .models import Gallery

class GallerySerializer(serializers.ModelSerializer):
    event_date = serializers.DateField(format="%Y-%m-%d")
    class Meta:
        model = Gallery
        fields =[
            'id', 'title_en', 'title_jp', 'event_date', 'cover_image_url',
            'google_photos_url', 'created_at', 'created_by'
        ]
        read_only_fields = (
            'id',
            'created_at',
            'created_by',
        )