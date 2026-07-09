# Linnea Pet Shop 绘本数据映射

## 旧文件位置

- PDF: `linnea_pet_shop_book/Linnea_Pet_Shop_Where_Is_Dodo.pdf`
- 图片源文件: `linnea_pet_shop_book/assets/*.png`
- 渲染页: `linnea_pet_shop_book/rendered_pages/*.png`

## 统一后台映射

- `projects.id`: `linnea-pet-shop-where-is-dodo`
- `projects.type`: `picture_book`
- `picture_books.file_type`: `pdf`，同时保留图片页来源。
- `picture_books.page_count`: 12
- `reading_records.status`: `not_started`、`reading`、`finished`
- `reading_records.current_page`: 当前页码
- `reading_records.child_feedback`: 暖暖反馈
- `reading_records.parent_notes`: 家长备注

## 接入状态

本地已完成档案扫描。上传 Supabase Storage 或保持本地受控访问，需要等 Supabase/部署权限确认。
