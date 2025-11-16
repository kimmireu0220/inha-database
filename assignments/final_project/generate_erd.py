#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AIRLINE 데이터베이스 ERD 생성 스크립트
"""

import pymysql
from graphviz import Digraph

# 데이터베이스 연결
conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='dbuser',
    password='c3409711!',
    database='AIRLINE',
    charset='utf8mb4'
)

cursor = conn.cursor()

# ERD 그래프 생성
dot = Digraph(comment='AIRLINE Database ERD', format='png')
dot.attr(rankdir='LR', size='20,15')
dot.attr('node', shape='record', style='rounded')

# 테이블 정보 가져오기
cursor.execute("""
    SELECT TABLE_NAME 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = 'AIRLINE' 
    AND TABLE_TYPE = 'BASE TABLE'
    ORDER BY TABLE_NAME
""")
tables = [row[0] for row in cursor.fetchall()]

# 각 테이블의 컬럼 정보 가져오기
table_info = {}
for table in tables:
    cursor.execute(f"""
        SELECT COLUMN_NAME, COLUMN_KEY, DATA_TYPE, IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'AIRLINE' AND TABLE_NAME = '{table}'
        ORDER BY ORDINAL_POSITION
    """)
    columns = cursor.fetchall()
    table_info[table] = columns

# 테이블 노드 생성
for table in tables:
    label_parts = [f"{{ {table} }}"]
    for col_name, col_key, data_type, is_nullable in table_info[table]:
        if col_key == 'PRI':
            label_parts.append(f"*{col_name}* ({data_type})")
        elif col_key == 'MUL':
            label_parts.append(f"_{col_name}_ ({data_type})")
        else:
            label_parts.append(f"{col_name} ({data_type})")
    
    label = "|".join(label_parts)
    dot.node(table, label)

# 외래키 관계 가져오기
cursor.execute("""
    SELECT 
        tc.TABLE_NAME,
        kcu.COLUMN_NAME,
        kcu.REFERENCED_TABLE_NAME,
        kcu.REFERENCED_COLUMN_NAME
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
    JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
        ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
        AND tc.TABLE_SCHEMA = kcu.TABLE_SCHEMA
    WHERE tc.TABLE_SCHEMA = 'AIRLINE'
        AND tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
    ORDER BY tc.TABLE_NAME
""")
foreign_keys = cursor.fetchall()

# 관계선 생성
for table_name, column_name, ref_table, ref_column in foreign_keys:
    if ref_table:  # 참조 테이블이 있는 경우만
        dot.edge(table_name, ref_table, label=column_name)

# 그래프 렌더링
output_file = 'AIRLINE_ERD'
dot.render(output_file, cleanup=True)
print(f"ERD 생성 완료: {output_file}.png")

conn.close()

