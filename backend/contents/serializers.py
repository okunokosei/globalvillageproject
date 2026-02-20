from rest_framework import serializers
from .models import Notice, NoticeTag

class NoticeTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeTag
        fields = ['id', 'name', 'slug', 'color_code']

class NoticeSerializer(serializers.ModelSerializer):
    # tag = NoticeTagSerializer(read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    # updated_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Notice
        fields = [
            'id', 'tag', 'title_en', 'title_jp', 
            'body_en', 'body_jp', 'image', 'is_pinned', 'created_at'
        ]
        read_only_fields = (
            'id',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        )
        # 「お、tag は外部キーだな。じゃあ、データベースのID（主キー）をそのまま出しとこ。」という挙動をする。
        # 「tag = NoticeTagSerializer(read_only=True)」と指定することで、主キーじゃなくて、NoticeTagSerializerを使って変換する！
    def to_representation(self, instance):
        response = super().to_representation(instance)
        if instance.tag:
            response['tag'] = NoticeTagSerializer(instance.tag).data
        return response



