from rest_framework import serializers
from .models import Notice, NoticeTag, NoticeImage

class NoticeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeImage
        fields = ['id', 'image']

class NoticeTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeTag
        fields = ['id', 'name', 'slug', 'color_code']

class NoticeSerializer(serializers.ModelSerializer):
    
    # 「入力のルール（バリデーション）」と「出力の基本フォーマット」を同時に決める場所
    # 「read_only=True」は、「バリデーションチェックもしない」し、「POSTで送られてきたデータを完全に捨て去る」強い指定
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    
    # 「many=Trueで配列を返す設定」、「imagesはrelated_name。親側がリモコンだけ持ってるイメージ」
    images = NoticeImageSerializer(many=True, read_only=True)

    class Meta:
        model = Notice
        fields = [
            'id', 'tag', 'title_en', 'title_jp', 
            'body_en', 'body_jp', 'images', 'is_pinned', 'created_at'
        ]
        read_only_fields = (
            'id',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        )
    
    # 「出力の直前に、データを改造する最終関門」
    def to_representation(self, instance):
        response = super().to_representation(instance)
        if instance.tag:
            response['tag'] = NoticeTagSerializer(instance.tag).data
        return response



