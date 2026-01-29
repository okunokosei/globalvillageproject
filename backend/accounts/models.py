import os
import uuid

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import RegexValidator

# パスを計算
def icon_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('icons', str(instance.id), filename)


# -------------------------------------
# ユーザーマネージャー
# -------------------------------------
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('メールアドレスは必須です')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        
        return self.create_user(email, password, **extra_fields)


# -------------------------------------
# ユーザーモデル
# -------------------------------------
class User(AbstractBaseUser, PermissionsMixin):

    class RoleType(models.TextChoices):
        RESIDENT = 'Resident', '一般寮生'
        ADMIN = 'Admin', '管理者'

    class PositionType(models.TextChoices):
        RESIDENT = 'Resident', '寮生'
        RT = 'RT', 'RT(レジデントチューター)'
        STAFF = 'Office Staff', '事務室スタッフ'

    class LanguageType(models.TextChoices):
        JAPANESE = 'JP', '日本語'
        ENGLISH = 'EN', '英語'


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    supabase_user_id = models.UUIDField(verbose_name="Supabase UUID", null=True, blank=True, unique=True)

    email = models.EmailField(verbose_name="e-mail", max_length=255, unique=True)
    name = models.CharField(verbose_name="名前", max_length = 50)
    room_number = models.CharField(
        verbose_name="部屋番号",
        max_length = 10,
        validators=[
            RegexValidator(
                regex=r'^[A-Z][0-9]{3}$',
                message="部屋番号は「A312」のように、大文字アルファベット1文字と数字3桁で入力してください。"
            )
        ],
        help_text="例 : A312 (大文字アルファベット1文字 + 数字3桁)"
        )

    role = models.CharField(verbose_name="アカウント権限", max_length = 20, choices=RoleType.choices, default=RoleType.RESIDENT)
    position = models.CharField(verbose_name="役割", max_length = 20, choices=PositionType.choices, default=PositionType.RESIDENT)
    language_preference = models.CharField(verbose_name="言語設定", max_length=2, choices=LanguageType.choices, default=LanguageType.ENGLISH)

    move_in_date = models.DateField(verbose_name="入寮年月", help_text="日は便宜上「1日」として扱われます")
    move_out_date = models.DateField(verbose_name="退寮予定年月")
    
    # icons_url = models.URLField(verbose_name="アイコンURL", null=True, blank=True)
    icon = models.ImageField(
        verbose_name="アイコン画像",
        upload_to=icon_upload_path,
        null=True,
        blank=True
    )

    is_active = models.BooleanField(default=True, verbose_name="有効フラグ")
    is_staff = models.BooleanField(default=False, verbose_name="管理画面アクセス権")

    created_at = models.DateTimeField(verbose_name="会員登録日", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="更新日", auto_now=True)


    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'room_number']

    def __str__(self):
        return f"{self.name} ({self.room_number})"
    
    class Meta:
        verbose_name = verbose_name_plural = 'ユーザー情報'
