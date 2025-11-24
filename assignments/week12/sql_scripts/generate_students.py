#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
10만명 이상의 학생 데이터 생성 스크립트
"""

import random
import string

# 한국 이름 리스트
korean_first_names = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '류', '전']
korean_last_names = ['민준', '서준', '도윤', '예준', '시우', '하준', '주원', '지호', '준서', '건우', 
                     '서연', '서윤', '지우', '서현', '민서', '하은', '예은', '윤서', '채원', '지원']

# 이메일 도메인
email_domains = ['inha.ac.kr', 'naver.com', 'gmail.com', 'daum.net', 'kakao.com']

def generate_korean_name():
    """한국 이름 생성"""
    first = random.choice(korean_first_names)
    last = random.choice(korean_last_names)
    return first + last

def generate_email(name, student_id):
    """이메일 생성"""
    domain = random.choice(email_domains)
    if domain == 'inha.ac.kr':
        return f"{name.lower()}{student_id % 1000}@{domain}"
    else:
        return f"{name.lower()}{random.randint(100, 999)}@{domain}"

def generate_phone():
    """전화번호 생성 (010-XXXX-XXXX)"""
    middle = random.randint(1000, 9999)
    last = random.randint(1000, 9999)
    return f"010{middle:04d}{last:04d}"

def generate_password():
    """비밀번호 생성 (4자리 숫자)"""
    return str(random.randint(1000, 9999))

def generate_students(num_students=100000, start_student_id=12000000):
    """학생 데이터 생성"""
    print(f"-- {num_students}명의 학생 데이터 생성")
    print("USE WEEK11_INHA_DB;")
    print()
    print("-- 기존 데이터 삭제 (선택사항)")
    print("-- DELETE FROM Student WHERE StudentId >= 12000000;")
    print()
    print("-- 학생 데이터 삽입")
    print("INSERT INTO Student (Sname, Semail, Sphonenum, StudentId, password, Did) VALUES")
    
    values = []
    for i in range(num_students):
        student_id = start_student_id + i
        name = generate_korean_name()
        email = generate_email(name, student_id)
        phone = generate_phone()
        password = generate_password()
        
        value = f"('{name}', '{email}', '{phone}', {student_id}, '{password}', 1)"
        values.append(value)
        
        # 1000개씩 배치로 출력 (성능 향상)
        if (i + 1) % 1000 == 0:
            print(",\n".join(values) + ",")
            values = []
            print(f"-- {i + 1}개 생성 완료")
    
    # 마지막 배치
    if values:
        print(",\n".join(values) + ";")
    
    print()
    print(f"-- 총 {num_students}명의 학생 데이터 생성 완료")

if __name__ == "__main__":
    # 10만명 생성
    generate_students(100000, 12000000)




