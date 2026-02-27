from rest_framework import serializers
from .models import Events, EventImage

class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = ['id', 'image']

class EventSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%Y-%m-%d")
    start_time = serializers.TimeField(format="%H:%M")
    end_time = serializers.TimeField(format="%H:%M")

    images = EventImageSerializer(many=True, read_only=True)

    class Meta:
        model = Events
        fields = [
            'id', 'title_en', 'title_jp', 'description_en', 'description_jp', 'location',
            'date', 'start_time', 'end_time', 'images', 'google_form_url', 
            # 'created_by', 'updated_by', 'created_at', 'updated_at',
        ]
        read_only_fields = (
            'id',
            'created_by',
            'updated_by',
            'created_at',
            'updated_at',
        )


