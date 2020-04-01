---
title: "My Project List"
date: 2020-04-01 10:00:00 +0900
categories: Yaki Introduce
---

### Penetration Test Security Network

- 프로젝트 명 : Drop the Packet
  - 기간 : 2019.12.04 ~ 2020.01.02
- 사내 네트워크의 안전과 웹 서버의 보안이 적절한가를 테스트 하기 위한 모의 해킹 망 구축 및 운영
- 모의 해킹 수행
  - Scanning
  - Network Hacking
  - Web Hacking
  - Metasploit Vulnerability Exploit
- 보안 장비 운영
  - IDS(Instruction Detection System), IPS(Intrusion Prevention System)
  - Anti - DDoS
  - WAF(Web Application Firewall)
  - NAC(Network Access Control)
  - ESM(Enterprise Security Management)
  - Server & Network Monitoring



<img src="/assets/images/SQLInjection.png" alt="Blind SQL Injection결과"/>



***

### Building a Secure Network Infrastructure

- 프로젝트 명 : KH Architectural Firm
  - 기간 : 2019.10.14 ~ 2019.10.22
- VLAN을 이용하여 내부 네트워크 분할
- 이중화
  - VRRP : 게이트웨이 이중화 프로토콜 사용
    - Master-backup 방식 사용
  - PVST : 각 VLAN 별로 루트 스위치를 따로 지정
    - VLAN 스패닝트리가 동작하기 때문에 부하분산 효과로 인한 VLAN별 최적의 경로 유지
  - 스패닝 트리(Spanning-Tree) : 스패닝 트리 프로토콜(STP) 이용
    - Switch를 이중화 하기 위한 프로토콜
    - 최적의 경로만 활성화 시키고 장애 발생 시 백업 경로를 활성화
- 보안망
  - UTM(Unified Threat Management) : 통합 위협 관리 시스템
    - 스테이트풀 인트팩션 방화벽과 침입 방지 및 안티바이러스 솔루션의 기능을 결합시킨 장비로 운영
  - VPN(Virtual Private Network)
    - Site - to - Site VPN 사용
    - 사용되는 프로토콜은 IPsec(Internet Protocol Security)



<img src="/assets/images/SemiTopology.PNG" alt="Network Topology" style="zoom: 50%;" />



***

### Web Hacking Web Tutorial Site

- 프로젝트 명 : Hacking Tutorial Site
  - 기간 : 2019.11.12 ~ 2019.11.24
- 웹 해킹을 연습할 수 있는 튜토리얼 홈페이지 구현
- SQL Injection, XSS, CSRF, ByPass 등의 해킹 기법을 테스트 할 수 있음
- 위 공격에 따른 보안 적용



<img src="/assets/images/TestSite.png" alt="TestSite" />



***

### Graduation Project (LEGO)

- 프로젝트 명 : LEGO
  - 기간 : 2018.12.27 ~ 2019.06.24
- Blockchain을 이용한 회계장부
- 서비스는 웹으로 제공되며, 핸드폰으로도 확인 가능하도록 사용자 UI를 제공
- O-Auth를 이용하여 회원가입 및 사용자 식별에 대한 편의성 제공
- Hyperledger Fabric의 Private기반의 Blockchain을 이용하여 데이터는 일반적으로 공개되지 않은 서버에서 작성
- 특정 그룹에 속한 회원들만 해당 그룹의 장부를 확인할 수 있음
- 사용자들은 자신에게 지급된 Hash 값을 이용하여 실제 데이터가 올바르게 작성 되었는가를 확인할 수 있음



<img src="/assets/images/Block.png" alt="Block" width="80%" height="70%" />



***

### BigData Project

- 프로젝트 명 : How is your Stress?
  - 기간 : 2019.05.15 ~ 2019.05.27
- 업무의 마감에 대한 스트래스에 관련된 Dataset을 사용
- 일반적인 사무 업무를 할당하여 25명의 피험자에 대하여 데이터를 수집
- 컴퓨터 로깅, 표정, 자세, ECG(심전도) 신호 및 피부 전도도 등의 데이터를 수집
- 업무를 하며 스트레스를 확인하여 스트레스가 없을(no_stress) 경우는 헬스 코치가 필요하지 않지만 그 외의 경우에는 사용자의 스트레스 수치가 증가하게 됨
- 피험자의 데이터를 참조하여 현재 진행되는 업무의 상태가 시간의 압박을 받는지(time_presure), 업무 중간에 메일을 받아 다른 업무가 생겼는지(interruption)를 확인할 수 있음
- 사용된 알고리즘
  - Clissifier : K-NN, Decision Tree, Random Forest, Gradient Boosting
  - Accuracy : accuracy_score, F1 Score
- 결론
  - 가장 적절한 알고리즘은 Random Forest이 되며, 적절한 트리의 깊이는 24
  - 실제 상황으로 본다면 사원의 상태를 파악하고 그에 따른 업무를 전달하여 업무의 능률을 높일 수 있을 것으로 보임
- [참조링크][https://github.com/yaki-toki/JupyterBigDataExercise/blob/master/NewBigDataProject.ipynb]



<img src="/assets/images/BigData.png" alt="데이터 상관관계" style="zoom: 25%;" />



***

### PC Supporter Homepage

- PC의 주요 부품별로 문제가 있거나 문의가 필요한 부분을 하나의 홈페이지 에서 해결할 수 있음
- 관리자는 어떤 부품에대한 문의가 얼마나 있는지 그래프를 이용하여 확인할 수 있음
- 사용자들은 본인의 요청이 어떤 상태인지 실시간으로 확인할 수 있음



<img src="/assets/images/PCSuppoter.png" alt="PCSuppoter" width="80%" height="60%" />


***

### Simple Encrypted Socket Communication

- 소켓 통신을 이용한 사용자 간의 통신
- 7계층 프로토콜을 설계하여 적용시킨 통신 프로그램
- 통신간의 데이터는 대칭키 암호화 방식인 AES 암호화 방식을 적용
  - Key를 전달할 방식을 찾지 못 하여 지정된 Key로 암/복호화를 수행
  - 이 부분을 수정하면 MITM공격이 없는 한 안전한 암호화 통신이 가능할 수 있을 것으로 보임



<img src="/assets/images/Socket.png" alt="통신 과정" style="zoom:50%;" />

<img src="/assets/images/Socket1.png" alt="암호화 데이터" width="70%" height="60%" />



***

### Study Alarm Table

- 각 사람마다 자신의 공부 흐름이 다양하기 때문에 스스로 인지할 수 있을 정도의 타이머를 어플로 제공
- 사용자는 공부 시간, 휴식 시간등을 지정하여 타이머를 설정할 수 있음
- 어플 내에서 타이머를 수정 하는 경우 이벤트를 발생시켜 진행 중이던 타이머를 종료 시키고 새로운 타이머를 수행



<img src="/assets/images/Altable.png" alt="Altable" width="200px" height="350px" />



***

### .NET Project

- 사내 사원들의 인트라넷 회원가입을 관리하는 솔루션
- 특정 사원이 자신의 사번을 이용하여 인트라넷에 회원 가입을 요청하면 인사팀에서 옳바른 사원인지를 확인하여 등록 해 주는 시스템
- MVVM(Model - View - View Model) 구현 방식 사용



<img src="/assets/images/DotNetProject.png" alt="회원가입 관리" width="60%" height="50%" />



***

### Car Owner Inquiry System

- 주차 공간이 좁은 상태에서 차량이 길을 막아서고 있으면 나가는 데에 어려움이 생김
- 차량 주인이 자신의 번호를 적어두지 않은 경우 곤란한 상황이 발생 됨
- 차량의 번호를 이용하여 차주의 번호(안심번호)를 이용할 수 있도록 조희를 해 주는 시스템
- PyQt로 제작된 윈도우 응용 프로그램
- 사용자가 직접 등록 할 수 있음
- 등록된 정보는 서버에 존재하는 DB내에 기록 됨



<img src="/assets/images/CarNumber.png" alt="CarNumber"  width="50%" height="40%" />



***

### DDoS Attack Simulation

- 수업 프로젝트로 진행된 모의 해킹
- 공격자는 여러 대의 Zombie PC를 만들어 하나의 서버를 공격
  - Zombie PC를 만드는 방법을 알 수 없었기 때문에 지정된 몇몇 PC에 특정 프로그램을 설치하고 공격자의 명령을 대기 시킴
- 공격자가 특정 명령을 연결된 Zombie PC에게 전달하면 즉각 DDoS 공격을 수행
- 공격에 사용된 기법은 SYN Flooding으로 공격 대상은 SYN패킷을 받은 후 ACK패킷을 받기 까지 대기하며 새로운 요청에 대한 응답을 못 하게 만듬



<img src="/assets/images/InternetSecurity1.png" alt="공격 구상도" width="100%" height="50%" />
