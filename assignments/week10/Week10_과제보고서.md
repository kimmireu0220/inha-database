# 데이터베이스 설계 10주차 과제 보고서

---

## 보고서 작성 서약서

**나는 보고서 작성시 윤리에 어긋난 행동을 하지 않고 정보통신공학인으로서 나의 명예를 지킬 것을 맹세합니다.**

---

## 1. 개요

### 1.1 과제 목표
본 과제는 7주차에서 구현한 Inha DB 웹 애플리케이션에 로그인 기능과 수강취소 기능을 추가하는 것입니다. 학생의 학번과 전화번호를 이용한 로그인 시스템을 구현하고, 로그인한 학생만 자신의 정보를 조회하고 수강 중인 수업을 수강취소할 수 있도록 권한 관리를 적용했습니다.

### 1.2 구현 요구사항
- **STEP 1**: 7주차 Inha DB 웹에 로그인 기능 적용
  - 학생의 학번(Id) 및 비밀번호(전화번호, PhoneNumber)로 로그인
  - 로그인 성공 시 학생 정보 조회 페이지로 이동
  - 로그인 실패 시 경고 창 팝업
  
- **STEP 2**: 수강취소 기능 구현
  - `localhost:3000/delete/class` 페이지 생성
  - 학생으로 로그인한 경우에만 접근 가능
  - 수강하는 수업(class)을 수강취소(삭제)할 수 있는 기능

### 1.3 사용 기술
- **백엔드**: Node.js, Express.js
- **데이터베이스**: MySQL (InhaDB)
- **템플릿 엔진**: Handlebars (hbs)
- **세션 관리**: express-session
- **데이터베이스 연결**: mysql2

---

## 2. 상세 설계 내용

### 2.1 데이터베이스 구조 확장

#### 2.1.1 Enrollment 테이블 생성
학생과 수업 간의 관계를 나타내기 위해 `Enrollment` 테이블을 생성했습니다.

```sql
CREATE TABLE IF NOT EXISTS Enrollment (
    Student_Id INT,
    Class_Id INT,
    PRIMARY KEY (Student_Id, Class_Id),
    FOREIGN KEY (Student_Id) REFERENCES Student(Id) ON DELETE CASCADE,
    FOREIGN KEY (Class_Id) REFERENCES Class(Id) ON DELETE CASCADE
);
```

**설계 사고 과정**: 
- Student와 Class 테이블은 이미 존재했지만, 학생이 어떤 수업을 수강하는지 나타내는 관계 테이블이 없었습니다.
- 다대다 관계를 표현하기 위해 Enrollment 테이블을 생성하여 Student_Id와 Class_Id를 외래키로 사용했습니다.
- CASCADE 옵션을 사용하여 학생이나 수업이 삭제될 때 관련 수강 정보도 자동으로 삭제되도록 설계했습니다.

#### 2.1.2 샘플 데이터 삽입
테스트를 위해 수강 정보를 삽입했습니다:
- 학생 1번: 수업 2번(Data Structures) 수강
- 학생 2번: 수업 1번(Database), 수업 3번(Circuit Theory) 수강
- 학생 3번: 수업 2번(Data Structures), 수업 3번(Circuit Theory) 수강

### 2.2 로그인 기능 구현 (STEP 1)

#### 2.2.1 로그인 라우터 구현
`routes/login.js` 파일을 생성하여 로그인 기능을 구현했습니다.

**핵심 코드**:
```56:60:assignments/week7/database/sql.js
    getStudentByLogin: async (id, phoneNumber) => {
        const sql = `select * from Student where Id = ${id} and PhoneNumber = "${phoneNumber}"`;
        const [result] = await promisePool.query(sql);
        return result[0];
    },
```

```10:39:assignments/week7/routes/login.js
router.post('/', async (req, res) => {
    const vars = req.body;
    
    try {
        // Student 테이블에서 Id(학번)와 PhoneNumber(비밀번호)로 검증
        const student = await selectSql.getStudentByLogin(vars.id, vars.password);
        
        if (student) {
            console.log('login success!');
            req.session.user = { 
                id: student.Id, 
                role: 'student', 
                checkLogin: true 
            };
            res.redirect('/select');
        } else {
            console.log('login failed!');
            res.send(`<script>
                        alert('login failed!');
                        location.href='/';
                    </script>`);
        }
    } catch (error) {
        console.error('Login error:', error);
        res.send(`<script>
                    alert('로그인 중 오류가 발생했습니다.');
                    location.href='/';
                </script>`);
    }
});
```

**알고리즘 동작 과정**:
1. 사용자가 로그인 폼에서 학번과 비밀번호(전화번호)를 입력합니다.
2. POST 요청이 들어오면 `getStudentByLogin()` 함수를 호출하여 Student 테이블에서 해당 학번과 전화번호가 일치하는 학생을 조회합니다.
3. 학생 정보가 존재하면 세션에 사용자 정보를 저장합니다 (`id`, `role: 'student'`, `checkLogin: true`).
4. 로그인 성공 시 `/select` 페이지로 리다이렉트합니다.
5. 학생 정보가 없으면 경고 창을 띄우고 로그인 페이지로 다시 이동합니다.

**구현 방식과 사고 과정**:
- Week10의 기본 템플릿을 참고하되, Student 테이블 구조에 맞게 수정했습니다.
- 기존 Week10은 user 테이블을 사용했지만, 본 과제에서는 Student 테이블의 Id와 PhoneNumber를 직접 사용했습니다.
- 세션을 사용하여 로그인 상태를 유지하고, 이후 페이지에서 권한을 체크할 수 있도록 설계했습니다.
- 에러 처리를 위해 try-catch 블록을 사용하여 예외 상황을 처리했습니다.

#### 2.2.2 데이터베이스 쿼리 함수 추가
`database/sql.js`에 로그인 관련 쿼리 함수를 추가했습니다.

**설계 사고 과정**:
- 학번(Id)과 전화번호(PhoneNumber)를 동시에 조건으로 사용하여 정확한 학생을 찾습니다.
- SQL Injection을 방지하기 위해 나중에 prepared statement로 개선할 수 있지만, 과제 요구사항에 맞게 기본적인 구현을 완료했습니다.

#### 2.2.3 로그인 페이지 구현
`views/login.hbs` 파일을 생성하여 로그인 폼을 구현했습니다.

**주요 특징**:
- 학번 입력 필드: `name="id"` 속성으로 학번을 입력받습니다.
- 비밀번호 입력 필드: `name="password"` 속성으로 전화번호를 입력받습니다.
- Week10의 로그인 페이지 스타일을 참고하여 일관된 UI를 제공했습니다.

#### 2.2.4 학생 정보 조회 페이지 수정
`routes/select.js`를 수정하여 로그인한 학생의 정보만 조회하도록 변경했습니다.

**핵심 코드**:
```6:38:assignments/week7/routes/select.js
router.get('/', async (req, res) => {
    // 권한 체크: 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!req.session.user || !req.session.user.checkLogin) {
        return res.redirect('/');
    }

    // 로그인한 학생의 정보만 조회
    const studentId = req.session.user.id;
    const Student = await selectSql.getStudentById(studentId);
    
    // 전체 테이블 정보도 조회 (기존 기능 유지)
    const Building = await selectSql.getBuilding();
    const Department = await selectSql.getDepartment();
    const Room = await selectSql.getRoom();
    const Class = await selectSql.getClass();

    // 학생 정보를 배열로 변환 (템플릿 호환성)
    const StudentArray = Student ? [Student] : [];

    res.render('select', {
        main_title: "Tables in InhaDB",
        title1: "Building",
        title2: "Department",
        title3: "Room",
        title4: "Student (내 정보)",
        title5: "Class",
        Building,
        Department,
        Room,
        Student: StudentArray,
        Class,
    })
})
```

**알고리즘 동작 과정**:
1. 페이지 접속 시 세션에 로그인 정보가 있는지 확인합니다.
2. 로그인하지 않은 경우 `/`로 리다이렉트합니다.
3. 로그인한 경우 세션에서 학생 ID를 가져옵니다.
4. `getStudentById()` 함수를 사용하여 해당 학생의 정보만 조회합니다.
5. 전체 테이블 정보도 함께 조회하여 기존 기능을 유지합니다.

**구현 방식과 사고 과정**:
- 기존에는 모든 학생 정보를 조회했지만, 로그인한 학생의 정보만 표시하도록 변경했습니다.
- 다른 테이블 정보는 그대로 유지하여 전체 데이터베이스 구조를 확인할 수 있도록 했습니다.
- 템플릿 호환성을 위해 단일 학생 객체를 배열로 변환했습니다.

### 2.3 수강취소 기능 구현 (STEP 2)

#### 2.3.1 수강취소 라우터 구현
`routes/delete.js` 파일을 생성하여 수강취소 기능을 구현했습니다.

**핵심 코드**:
```7:29:assignments/week7/routes/delete.js
router.get('/class', async (req, res) => {
    // 권한 체크: 학생으로 로그인한 경우에만 접근 가능
    if (!req.session.user || !req.session.user.checkLogin || req.session.user.role !== 'student') {
        return res.redirect('/');
    }

    try {
        const studentId = req.session.user.id;
        // 해당 학생이 수강하는 수업 목록 조회
        const enrolledClasses = await selectSql.getEnrolledClasses(studentId);
        
        res.render('deleteClass', {
            title: "수강취소",
            classes: enrolledClasses,
        });
    } catch (error) {
        console.error('Error fetching enrolled classes:', error);
        res.send(`<script>
                    alert('수강 정보를 불러오는 중 오류가 발생했습니다.');
                    location.href='/select';
                </script>`);
    }
});
```

```32:54:assignments/week7/routes/delete.js
router.post('/class', async (req, res) => {
    // 권한 체크
    if (!req.session.user || !req.session.user.checkLogin || req.session.user.role !== 'student') {
        return res.redirect('/');
    }

    try {
        const studentId = req.session.user.id;
        const classId = req.body.classId;
        
        console.log("수강취소 - Student_Id:", studentId, "Class_Id:", classId);
        
        await deleteSql.deleteEnrollment(studentId, classId);
        
        res.redirect('/delete/class');
    } catch (error) {
        console.error('Error deleting enrollment:', error);
        res.send(`<script>
                    alert('수강취소 중 오류가 발생했습니다.');
                    location.href='/delete/class';
                </script>`);
    }
});
```

**알고리즘 동작 과정**:
1. GET `/delete/class`: 
   - 세션에서 로그인 정보와 학생 권한을 확인합니다.
   - 로그인하지 않았거나 학생 권한이 아니면 로그인 페이지로 리다이렉트합니다.
   - 로그인한 학생의 ID를 가져와 `getEnrolledClasses()` 함수로 수강 중인 수업 목록을 조회합니다.
   - 수강 수업 목록을 템플릿에 전달하여 화면에 표시합니다.

2. POST `/delete/class`:
   - 권한을 다시 한 번 확인합니다.
   - 요청 본문에서 `classId`를 가져옵니다.
   - `deleteEnrollment()` 함수를 호출하여 Enrollment 테이블에서 해당 레코드를 삭제합니다.
   - 삭제 후 수강취소 페이지로 다시 리다이렉트하여 업데이트된 목록을 표시합니다.

**구현 방식과 사고 과정**:
- Week10의 delete 라우터를 참고하되, Enrollment 테이블 구조에 맞게 수정했습니다.
- 보안을 위해 GET과 POST 모두에서 권한을 체크하도록 구현했습니다.
- 삭제 후 같은 페이지로 리다이렉트하여 사용자가 즉시 변경사항을 확인할 수 있도록 했습니다.
- 에러 발생 시 사용자에게 알림을 제공하고 적절한 페이지로 이동하도록 처리했습니다.

#### 2.3.2 데이터베이스 쿼리 함수 추가
수강 수업 조회 및 삭제를 위한 쿼리 함수를 추가했습니다.

```61:70:assignments/week7/database/sql.js
    getEnrolledClasses: async (studentId) => {
        const sql = `
            select c.Id, c.Name, c.Professor, c.Number_of_participants
            from Class c
            inner join Enrollment e on c.Id = e.Class_Id
            where e.Student_Id = ${studentId}
        `;
        const [result] = await promisePool.query(sql);
        return result;
    },
```

```111:117:assignments/week7/database/sql.js
export const deleteSql = {
    deleteEnrollment: async (studentId, classId) => {
        const sql = `delete from Enrollment where Student_Id = ${studentId} and Class_Id = ${classId}`;
        console.log(sql);
        await promisePool.query(sql);
    },
};
```

**설계 사고 과정**:
- `getEnrolledClasses()`: Enrollment 테이블과 Class 테이블을 INNER JOIN하여 해당 학생이 수강하는 수업의 상세 정보를 가져옵니다.
- `deleteEnrollment()`: Student_Id와 Class_Id를 모두 조건으로 사용하여 정확한 수강 정보만 삭제합니다.
- 두 조건을 모두 사용함으로써 다른 학생의 수강 정보를 실수로 삭제하는 것을 방지합니다.

#### 2.3.3 수강취소 페이지 구현
`views/deleteClass.hbs` 파일을 생성하여 수강취소 페이지를 구현했습니다.

**주요 특징**:
- 수강 중인 수업 목록을 테이블 형태로 표시합니다.
- 각 수업마다 "수강취소" 버튼을 제공합니다.
- 버튼 클릭 시 해당 수업의 ID가 hidden input으로 전송됩니다.
- 수강 중인 수업이 없을 경우 안내 메시지를 표시합니다.

### 2.4 세션 관리 설정

#### 2.4.1 express-session 미들웨어 설정
`src/index.js`에 세션 미들웨어를 추가했습니다.

```21:27:assignments/week7/src/index.js
app.use(
    expressSession({
        secret: "my key",
        resave: true,
        saveUninitialized: true,
    })
);
```

**설계 사고 과정**:
- `secret`: 세션 쿠키를 암호화하기 위한 비밀키입니다.
- `resave`: 세션이 수정되지 않아도 저장하도록 설정했습니다.
- `saveUninitialized`: 초기화되지 않은 세션도 저장하도록 설정했습니다.
- 세션을 통해 로그인 상태를 유지하고, 각 페이지에서 권한을 체크할 수 있도록 했습니다.

#### 2.4.2 라우터 등록
로그인 및 수강취소 라우터를 등록했습니다.

```39:43:assignments/week7/src/index.js
app.use('/', loginRouter);
app.use('/home', homeRouter);
app.use('/select', selectRouter);
app.use('/update', updateRouter);
app.use('/delete', deleteRouter);
```

**설계 사고 과정**:
- `/` 경로를 loginRouter로 등록하여 기본 경로가 로그인 페이지가 되도록 했습니다.
- 기존 `/` 경로에 있던 homeRouter는 `/home`으로 변경하여 기존 기능을 유지했습니다.
- `/delete/class` 경로는 deleteRouter에서 처리하도록 구현했습니다.

---

## 3. 실행 화면

### 3.1 로그인 페이지
![로그인 페이지](../week7/screenshots/01_login_page.png)

**설명**: 
- 초기 접속 시 표시되는 로그인 페이지입니다.
- 학번(ID)과 비밀번호(전화번호) 입력 필드가 있습니다.
- "Login" 버튼을 클릭하여 로그인을 진행합니다.

### 3.2 학생 정보 조회 페이지 (로그인 성공 후)
![학생 정보 조회 페이지](../week7/screenshots/02_student_info_page.png)

**설명**:
- 로그인 성공 후 자동으로 이동하는 페이지입니다.
- 로그인한 학생(학생 2번: Hong Gil Dong)의 정보가 "Student (내 정보)" 섹션에 표시됩니다.
- Building, Department, Room, Class 테이블 정보도 함께 표시되어 전체 데이터베이스 구조를 확인할 수 있습니다.

### 3.3 수강취소 페이지 (삭제 전)
![수강취소 페이지](../week7/screenshots/03_delete_class_page.png)

**설명**:
- `localhost:3000/delete/class` 경로로 접속한 화면입니다.
- 학생 2번이 수강하는 수업 2개가 표시됩니다:
  - Database (Prof. Choi)
  - Circuit Theory (Prof. Park)
- 각 수업마다 "수강취소" 버튼이 있어 클릭 시 해당 수업을 수강취소할 수 있습니다.

### 3.4 수강취소 페이지 (삭제 후)
![수강취소 후 화면](../week7/screenshots/04_after_delete_class.png)

**설명**:
- Database 수업의 "수강취소" 버튼을 클릭한 후의 화면입니다.
- Database 수업이 삭제되어 Circuit Theory 수업만 남아있습니다.
- 수강취소 기능이 정상적으로 작동하는 것을 확인할 수 있습니다.

### 3.5 로그인 실패 화면
![로그인 실패](../week7/screenshots/05_login_failed.png)

**설명**:
- 잘못된 학번이나 비밀번호를 입력한 경우 "login failed!" 알림 창이 표시됩니다.
- 알림 창을 닫으면 다시 로그인 페이지로 돌아옵니다.
- 보안을 위해 구체적인 오류 메시지는 표시하지 않습니다.

---

## 4. 결론

### 4.1 구현 결과
본 과제의 모든 요구사항을 성공적으로 구현했습니다.

**STEP 1: 로그인 기능**
- ✅ 학생의 학번과 전화번호로 로그인하는 기능 구현 완료
- ✅ 로그인 성공 시 학생 정보 조회 페이지로 이동
- ✅ 로그인 실패 시 경고 창 팝업 및 로그인 페이지로 복귀
- ✅ 세션을 통한 로그인 상태 유지

**STEP 2: 수강취소 기능**
- ✅ `localhost:3000/delete/class` 페이지 구현 완료
- ✅ 학생 권한 체크를 통한 접근 제어
- ✅ 수강 중인 수업 목록 조회 기능
- ✅ 수강취소(삭제) 기능 정상 작동

### 4.2 구현 과정에서의 주요 고려사항
1. **데이터베이스 설계**: Student와 Class 간의 관계를 나타내기 위해 Enrollment 테이블을 생성했습니다.
2. **보안**: 세션을 통한 권한 관리로 로그인하지 않은 사용자의 접근을 차단했습니다.
3. **사용자 경험**: 로그인 실패 시 명확한 피드백을 제공하고, 수강취소 후 즉시 업데이트된 목록을 표시했습니다.
4. **에러 처리**: try-catch 블록을 사용하여 예외 상황을 처리하고 사용자에게 알림을 제공했습니다.

### 4.3 개선 가능한 사항
1. **SQL Injection 방지**: 현재는 문자열 연결을 사용하지만, prepared statement를 사용하여 보안을 강화할 수 있습니다.
2. **비밀번호 암호화**: 현재는 전화번호를 평문으로 저장하지만, 실제 환경에서는 해시 함수를 사용하여 암호화해야 합니다.
3. **세션 만료 시간 설정**: 현재는 세션 만료 시간이 설정되어 있지 않으므로, 적절한 만료 시간을 설정할 수 있습니다.
4. **로깅 시스템**: 더 체계적인 로깅 시스템을 구축하여 디버깅과 모니터링을 개선할 수 있습니다.

### 4.4 최종 평가
본 과제를 통해 웹 애플리케이션에 로그인 기능과 권한 관리를 추가하는 방법을 학습했습니다. Express.js의 세션 관리 기능을 활용하여 사용자 인증과 권한 제어를 구현했으며, 데이터베이스 관계를 이해하고 Enrollment 테이블을 통해 학생과 수업 간의 관계를 표현했습니다. 모든 요구사항을 충족하는 완전한 기능을 구현했으며, 실제 테스트를 통해 정상 작동을 확인했습니다.

---

**보고서 작성일**: 2024년 11월 10일

