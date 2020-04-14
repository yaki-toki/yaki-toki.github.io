---
title: "My Project List"
date: 2020-04-01 10:00:00 +0900
categories: Yaki Introduce
---

# My Portfolio

### Penetration Testing Project

- 프로젝트 명 : Penetration Test Security Network
  - 기간 : 2019.12.04 ~ 2020.01.02
- 기술
  - 네트워크 가상화 및 이중화
  - 보안 장비 운용
  - 언어 : Python (Blind SQL Injection Tool 개발용)
- 프로젝트 내용
  - 사내 네트워크의 안전과 웹 서버의 보안이 적절한가를 테스트 하기 위한 모의 해킹 망 구축 및 운영
  - 보안 관제 센터를 구축하여 해킹 공격에 대한 네트워크 트래픽을 수집하며 대응할 수 있도록 설계
  - 보안이 취약한 서버에 대한 피드백과 해결 방안 및 버전 업데이트에 대한 방법을 제안
- 모의 해킹
  - Scanning
  - Network Hacking
  - Web Hacking
  - Metasploit Vulnerability Exploit
- 사용된 보안 장비
  - IDS(Instruction Detection System), IPS(Intrusion Prevention System)
  - Anti - DDoS
  - WAF(Web Application Firewall)
  - NAC(Network Access Control)
  - ESM(Enterprise Security Management)
  - Server & Network Monitoring

<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assets/images/InjectionSimulation.png" alt="Blind SQL Injection 구상도"/>
  <br/>
  &lt;Blind SQL Injection 구상도&gt;

  <br/>
  <img src="/assets/images/SQLInjection.png" alt="Blind SQL Injection결과"/>
  <br/>
  &lt;Blind SQL Injection 결과&gt;
</div>

***

### Security Network Construction Project

- 프로젝트 명 : Building a Secure Network Infrastructure
  - 기간 : 2019.10.14 ~ 2019.10.22
- 기술
  - VLAN을 이용하여 내부 네트워크 분할
  - 네트워크 이중화
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
- Framework
  - 가상 머신 : VMware Workstation 15, GNS 3
- 프로젝트 내용
  - 본사의 네트워크를 이중화 시켜 장애 발생에 대비하며, 지사와의 VPN 서버를 구축
  - Packet의 통제는 Stateful Inspection으로 운용하며 올바르지 않은 요청에 대해서는 즉각 차단 가능
  - 본사와 지사를 연결하는 네트워크는 Site-to-Site VPN을 사용하며, IPsec(Internet Protocol Security)를 이용하여 통신을 수행

<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assets/images/SemiTopology.PNG" alt="Network Topology"/>
  <br/>
  &lt;Security Network Topology&gt;

  <br/>
  <img src="/assets/images/MonitoringWindow.png" alt="Monitoring Window"/>
  <br/>
  &lt;Monitoring Window&gt;
</div>

***

### Web Hacking Tutorial Site

- 프로젝트 명 : Hacking Tutorial Site
  - 기간 : 2019.11.12 ~ 2019.11.24
- 기술
  - 언어 : PHP
  - SQL Injection을 대비한 정규 표현식 적용
  - 서버 보안 패치(버전 업데이트, 설정파일 보안 패치 등등)
- Tool
  - Atom Web Remote Server Connection
- 프로젝트 내용
  - 웹 해킹을 연습할 수 있는 튜토리얼 홈페이지 구현
  - SQL Injection, XSS, CSRF, ByPass 등의 해킹 기법을 테스트 할 수 있음
  - Webshell 업로드를 통한 서버에 권한 상승 Backdoor 파일 생성
  - Backdoor를 통한 웹 서버가 존재하는 장소의 네트워크망을 예측할 수 있음
  - [Github Repository](https://github.com/yaki-toki/AttackWeb)

<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assets/images/TestSite.png" alt="TestSite" />
  <br/>
  &lt;Web Hack Site&gt;
</div>
***

### Big Data Project

- 프로젝트 명 : How is your Stress?
  - 기간 : 2019.05.15 ~ 2019.05.27
- 기술
  - 언어 : Python
  - Supervised Machine Learning
  - Clissifier Algorithm: K-NN, Decision Tree, Random Forest, Gradient Boosting
- Framework
  - Visualization : Seaborn
  - Supervised Machine Learning : Sklearn
  - Accuracy : accuracy_score, F1 Score
- 프로젝트 내용
  - 업무의 마감에 대한 스트래스에 관련된 Dataset을 사용
  - 일반적인 사무 업무를 할당하여 25명의 피험자에 대하여 데이터를 수집
  - 컴퓨터 로깅, 표정, 자세, ECG(심전도) 신호 및 피부 전도도 등의 데이터를 수집
  - 업무를 하며 스트레스를 확인하여 스트레스가 없을(no_stress) 경우는 헬스 코치가 필요하지 않지만 그 외의 경우에는 사용자의 스트레스 수치가 증가하게 됨
  - 피험자의 데이터를 참조하여 현재 진행되는 업무의 상태가 시간의 압박을 받는지(time_presure), 업무 중간에 메일을 받아 다른 업무가 생겼는지(interruption)를 확인할 수 있음
  - 결론
    - 가장 적절한 알고리즘은 Random Forest이 되며, 적절한 트리의 깊이는 24
    - 실제 상황으로 본다면 사원의 상태를 파악하고 그에 따른 업무를 전달하여 업무의 능률을 높일 수 있을 것으로 보임
- [Github Repository](https://github.com/yaki-toki/JupyterBigDataExercise/blob/master/NewBigDataProject.ipynb)


<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assets/images/BigData.png" alt="데이터 상관관계" style="zoom: 25%;" />
  <br/>
  &lt;Data Correlation&gt;
  <br/>
  <img src="/assets/images/RandomForestClassifier.png" alt="Random Forest"/>
  <br/>
  &lt;Random Forest 예측 정확도&gt;
</div>

***


### Graduation Project (with Blockchain)

- 프로젝트 명 : LEGO
  - 기간 : 2018.12.27 ~ 2019.06.24
- 기술
  - 언어 : Java 8
  - Private Blockchain
  - O-Auth 2.0
  - Json Communication
- Framework
  - Spring
  - Hyperledger Composer
- 프로젝트 내용
  - Blockchain을 이용한 회계장부
  - 서비스는 웹으로 제공되며, 핸드폰으로도 확인 가능하도록 사용자 UI를 제공
  - O-Auth를 이용하여 회원가입 및 사용자 식별에 대한 편의성 제공
  - Hyperledger Fabric의 Private기반의 Blockchain을 이용하여 데이터는 일반적으로 공개되지 않은 서버에서 작성
  - 특정 그룹에 속한 회원들만 해당 그룹의 장부를 확인할 수 있음
  - 사용자들은 자신에게 지급된 Hash 값을 이용하여 실제 데이터가 올바르게 작성 되었는가를 확인할 수 있음
  - [Hyperledger Composer 서버설치 스크립트](https://github.com/yaki-toki/HyperledgerComposer)


<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assets/images/LEGO.png" alt="Login" width="60%" height="50%"/>
  <br/>
  &lt;Login 화면&gt;
  <br/>
  <img src="/assets/images/Block.png" alt="Block" width="80%" height="70%" />
  <br/>
  &lt;Data 출력 화면&gt;
</div>

***

### Arduino Project

- 프로젝트 명 : 올락낼락! 블라인드!
  - 기간 : 2018.11.03 ~ 2018.12.03
- 기술
  - Bluetooth 통신
  - Arduino 회로 설계
- Using Modules
  - 네트워크 장비 : Arduino Ethernet Shield W5100 A07
  - LCD화면 모듈 : LCD IIC/I2C Interface Adapter Plate Board
  - 모터 : 5V Stepper Motor
  - 블루투스 모듈 : HC-06 Bluetooth 3.0 Module
  - 미세먼지 농도 센서 : MQ-135 Gas Sensor
- 프로젝트 내용
  - 사용자는 Web 혹은 Bluetooth 중 어떤 통신을 할지 선정
  - Bluetooth
    - Android에서 제공하는 App인 'Arduino Bluetooth Controller'를 이용하여 Arduino와 연결
    - 미리 지정된 키워드 1 혹은 0의 메시지를 Bluetooth를 통해 BLE 통신을 수행
    - Bluetooth에서는 전송 받은 메시지를 확인하고 해당 메시지에 맞는 작업을 수행 (1. 블라인드 상승 / 0.. 블라인드 하강)
  - Web Service
    - 사용자는 미리 포트 포워딩으로 정의된 '210.123.254.245:9001' 서버로 접속
    - Web Browser에 UP, DOWN 글자를 클릭
    - Arduino는 사용자가 전송한 메시지를 확인하고 해당 기능을 수행
      - 서버와 Arduino가 통신하는 통신 방식은 GET 방식으로 수행

<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assets/images/BlindArduino.PNG" alt="설계도면" width="80%" height="70%" />
  <br/>
  &lt;설계도 화면&gt;<br/>
  <img src="/assets/images/RealArduino.png" alt="실제모습" width="80%" height="70%" />
  <br/>
  &lt;실제 모듈 구현 화면&gt;
</div>

***

### PC Supporter Homepage Project

- 프로젝트 명 : PC 지원 홈페이지
  - 기간 : 2018.11.03 ~ 2018.12.14
- 기술
  - 언어 : Java 8
  - Jakarta DBCP API
  - MD5 Hash Password 암호화
- Framework
  - JSTL(Java Server Tag Library), EL(Expression Language)
- 프로젝트 내용
  - PC의 주요 부품별로 문제가 있거나 문의가 필요한 부분을 하나의 홈페이지 에서 해결할 수 있음
  - 관리자는 어떤 부품에대한 문의가 얼마나 있는지 그래프를 이용하여 확인할 수 있음
  - 사용자들은 본인의 요청이 어떤 상태인지 실시간으로 확인할 수 있음
  - [Github Repository](https://github.com/yaki-toki/WebProject/tree/master/FinalyTest)

<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assets/images/PCSuppoter.png" alt="PCSuppoter" width="80%" height="60%" />
  <br/>
  &lt;PC 지원 요청 부품 비율&gt;
</div>

***

### Simple Encrypted Socket Communication Project

- 프로젝트 명 : 암호화 소켓 통신!
  - 기간 : 2018.11.02 ~ 2018.12.12
- 기술
  - 언어 : C#
  - Asynchronous Socket Communication
  - AES 대칭키 암호화 알고리즘
- Framework
  - .Net Framework
- 프로젝트 내용
  - 소켓 통신을 이용한 사용자 간의 통신
  - 7계층 프로토콜을 설계하여 적용시킨 통신 프로그램
  - 통신간의 데이터는 대칭키 암호화 방식인 AES 암호화 방식을 적용
    - Key를 전달할 방식을 찾지 못 하여 지정된 Key로 암/복호화를 수행
    - 이 부분을 수정하면 MITM공격이 없는 한 안전한 암호화 통신이 가능할 수 있을 것으로 보임
  - [Github Repository](https://github.com/yaki-toki/C-NetworkProgramming/tree/master/ChatClient)


<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assets/images/Socket.png" alt="통신 과정" style="zoom:50%;" />
  <br/>
  &lt;통신 과정&gt;<br/>
  <img src="/assets/images/Socket1.png" alt="암호화 데이터" width="70%" height="60%" />
  <br/>
  &lt;Wireshark Packet Capture&gt;
</div>

***

### Study Alarm Table Application Project

- 프로젝트 명 : AlTable(알테이블)
  - 기간 : 2018.07.02 ~ 2018.10.06
- 기술
  - 언어 : Java 8
  - Android Runtime
- Framework
  - Application Framework
- 프로젝트 내용
  - 각 사람마다 자신의 공부 흐름이 다양하기 때문에 스스로 인지할 수 있을 정도의 타이머를 어플로 제공
  - 사용자는 공부 시간, 휴식 시간등을 지정하여 타이머를 설정할 수 있음
  - 어플 내에서 타이머를 수정 하는 경우 이벤트를 발생시켜 진행 중이던 타이머를 종료 시키고 새로운 타이머를 수행


<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assets/images/Altable.png" alt="Altable" width="200px" height="350px" />
  <br/>
  &lt;Altable 어플 화면&gt;
</div>


***

### Intranet Member Management Project

- 프로젝트 명 : Intranet Member Management
  - 기간 : 2018.05.02 ~ 2018.06.05
- 기술
  - 언어 : C#
  - MVVM 개발 패턴 적용
- Framework
  - .NetFramework
- 프로젝트 내용
  - 사내 사원들의 인트라넷 회원가입을 관리하는 솔루션
  - 특정 사원이 자신의 사번을 이용하여 인트라넷에 회원가입을 요청하면 인사팀에서 옳바른 사원인지를 확인하여 등록 해 주는 시스템
  - MVVM(Model - View - View Model) 구현 방식 사용


<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assets/images/DotNetProject.png" alt="회원가입 관리" width="60%" height="50%" />
  <br/>
  &lt;회원가입 관리 화면&gt;
</div>


***

### Car Owner Inquiry System Project

- 프로젝트 명 : 너의 주인은 어디있니...?
  - 기간 : 2017.10.12 ~ 2017.12.04
- 기술
  - 언어 : Python
- Framework
  - PyQt (Python GUI 개발 Framework)
- 프로젝트 내용
  - 주차 공간이 좁은 상태에서 차량이 길을 막아서고 있으면 나가는 데에 어려움이 생김
  - 차량 주인이 자신의 번호를 적어두지 않은 경우 곤란한 상황이 발생 됨
  - 차량의 번호를 이용하여 차주의 번호(안심번호)를 이용할 수 있도록 조회를 해 주는 시스템
  - PyQt로 제작된 윈도우 응용 프로그램
  - 사용자가 직접 등록 할 수 있음
  - 등록된 정보는 서버에 존재하는 DB내에 기록 됨
  - [Github Repository](https://github.com/yaki-toki/Python)


<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assets/images/CarNumber.png" alt="CarNumber"  width="50%" height="40%" />
  <br/>
  &lt;차량 소유자 조회 화면&gt;
</div>


***

### D-DoS Attack Simulation Project

- 수업 프로젝트로 진행된 모의 해킹
- 공격자는 여러 대의 Zombie PC를 만들어 하나의 서버를 공격
  - Zombie PC를 만드는 방법을 알 수 없었기 때문에 지정된 몇몇 PC에 특정 프로그램을 설치하고 공격자의 명령을 대기 시킴
- 공격자가 특정 명령을 연결된 Zombie PC에게 전달하면 즉각 DDoS 공격을 수행
- 공격에 사용된 기법은 SYN Flooding으로 공격 대상은 SYN패킷을 받은 후 ACK패킷을 받기 까지 대기하며 새로운 요청에 대한 응답을 못 하게 만듬


<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assets/images/InternetSecurity1.png" alt="공격 구상도" width="100%" height="50%" />
  <br/>
  &lt;DDoS 공격 구상도&gt;
</div>