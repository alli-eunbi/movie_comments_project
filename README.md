>**[Title(제목) 작성 형식]** <br>
>-형식: OOO팀 프로젝트 개선 기획안.md<br>
>-예시: 3팀 프로젝트 개선 기획안.md<br>

## 팀명:

## docker-compose-dev.yml 사용방법
1. root 디렉터리에서 docker-compose -f docker-compose-dev.yml up 명령어 작성
    1.) 도커 이미지를 빌드하며 빌드된 이미지를 컨테이너화 시켜줍니다. => 빌드하는 과정이 오래걸릴수도 있습니다.

    2.) frontend, backend, mysql 컨테이너가 각각 실행되며 코드 작성을 진행하면 됩니다.

2. 컨테이너 중지 및 재실행 방법
    1.) 실행중인 컨테이너를 중지하기 위해 docker-compose -f docker-compose-dev.yml stop 명령어 작성

    2.) 중지한 컨테이너를 다시 실행시키는 명령어는 docker-compose -f docker-compose-dev.yml restart 명령어 작성

    3.) 도커 컨테이너를 중지하면서 빌드한 이미지를 전부 지우는 명령어 docker-compose -f docker-compose-dev.yml down --rmi all 명령어 작성

    4.) 도커 이미지를 한번 빌드하면 mysql/mysql_data 디렉터리가 생성되는데 이미지를 docker-compose -f docker-compose-dev.yml up 명령어로 다시 이미지를 빌드하게 되면 권한에러가 발생합니다.

    5.) 따라서 mysql/mysql_data의 권한을 chmod -R 777 mysql_data로 바꾸거나 rm -r mysql_data로 삭제한 후 다시 docker-compose -f docker-compose-dev.yml up 명령어를 실행하게 되면 이미지를 빌드하고 컨테이너를 실행하게 됩니다.


## 제목: OOO팀 프로젝트 개선 기획안

### 애자일 회고 결과
1. 잘했던 점<br>
    1)
    
2. 부족했던 점<br>
    1)

3. 개선 사항<br>
    1)

4. 개선 방안<br>
    1)


***

### 개발 타임라인

> - 회고 결과에서 정한 개선 방안을 바탕으로 개발 일정을 수립합니다.
> - 예시:
> - 1/20: 현재 위치 불러오기 기능 추가 등

### 스크럼 계획

>- 진행한 애자일 회고를 기반으로, 개선사항을 반영한 기획안을 제출합니다.
>- 기획안에는 “애자일 개발” 계획, 즉, 스크럼 계획을 반드시 포함합니다.
>- 예시:
>- “하루 몇시~몇시 동안 스크럼을 진행한다” 등
