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

    fields = ('name', 'email', 'room_number', 'student_id', 'role', 'is_staff', 'is_active', 'icon')

admin.site.register(User, UserAdmin)