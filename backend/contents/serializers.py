from rest_framework import serializers
from .models import Notice, NoticeTag, Guides, GuideCategories

class NoticeTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeTag
        fields = ['id', 'name', 'slug', 'color_code']

class NoticeSerializer(serializers.ModelSerializer):
    tag = NoticeTagSerializer(read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Notice
        fields = [
            'id', 'tag', 'title_en', 'title_jp', 
            'body_en', 'body_jp', 'image', 'is_pinned', 'created_at'
        ]
        # 「お、tag は外部キーだな。じゃあ、データベースのID（主キー）をそのまま出しとこ。」という挙動をする。
        # 「tag = NoticeTagSerializer(read_only=True)」と指定することで、主キーじゃなくて、NoticeTagSerializerを使って変換する！

class GuidesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guides
        fields = [
            'id', 'title_en', 'title_jp', 
            'body_en', 'body_jp', 'image'
        ]

class GuideCategorySerializer(serializers.ModelSerializer):
    guides = GuidesSerializer(many=True, read_only=True, source='guide')
    class Meta:
        model = GuideCategories
        fields = [
            'id', 'name_en', 'name_jp', 'icon_name', 'guides'
        ]

        # 子供(Guides)から親(GuideCategories)を探すとき、related_name（guide）を使う。
        # category.guide.all()とするだけで、親の現在の主キーidを確認して、related_name（guide）で指定されている中から、親の現在の主キーと一致するものを探してくれる。
        # foreign keyでの結びつけが、親の主キーidで行われていることが保証してくれる。

