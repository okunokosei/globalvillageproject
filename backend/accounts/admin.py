from django.contrib import admin
from .models import User

# Register your models here.

# admin.site.register(User)

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'room_number', 'email', 'is_staff', 'is_active')
    list_display_links = ('id', 'name')
    search_fields = ('name', 'email', 'room_number')
    list_filter = ('role', 'is_active', 'is_staff')
    ordering = ('email',)

    fields = (
        'supabase_user_id',  # ← 編集可能
        'name',
        'email',
        'password',          # パスワード変更用（ハッシュ化される前の値は見れません）
        'room_number',
        'role',
        'position',
        'language_preference',
        'move_in_date',
        'move_out_date',
        'icon',
        'is_active',
        'is_staff',
        'is_superuser',      # 必要であれば
        # 'last_login',
    )
    readonly_fields = ('id', 'last_login', 'created_at', 'updated_at')

admin.site.register(User, UserAdmin)