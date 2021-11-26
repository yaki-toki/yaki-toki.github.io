---
title: "Master's Course Project List"
date: 2021-11-26 12:00:00 +0900
categories: Yaki Introduce
---

## 빅데이터 기술 발전전략

- 프로젝트 명: 세컨드 스크린 광고 노출도 인식 개선
    - 기간: 2021.09 ~ 2021.11
- 기술
    - 언어: Java
    - OpenCV
        - Haarcascade: 고양이 및 얼굴 인식 모델
- 프로젝트 내용
    - 기존 로고 인식 애플리케이션 개선
    - 컨텐츠 내에서 로고를 인식 후 세컨드 스크린에서 해당 로고의 광고를 출력
    - 광고가 출력되면 해당 시점에서 사진 촬영
    - 촬영된 이미지를 분석하여 해당 광고의 정보와 시청중인 인원 수를 기록
<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assetsMasterCourse/images/그림5.png" alt="시스템 구성"/>
  <br/>
  &lt;시스템 구성&gt;

  <br/>
  <img src="/assetsMasterCourse/images/그림6.png" alt="분석 결과 기록"/>
  <br/>
  &lt;분석 결과 기록&gt;
</div>

## 딥러닝 알고리즘을 이용한 특정 동영상 컨텐츠 내 포즈 및 인식 시점 알고리즘 개발

- 프로젝트 명: 동영상 하이라이트 시점 태깅
    - 기간: 2021.01 ~ 2021.05
- 기술
    - 언어: Python 3.8
    - Deep learning
        - Object detection
        - Pose recognition
        - Scene classification
    - Machine learning
        - Classification
- Framework
    - Tensorflow 2.4
    - PyTorch 1.8
    - Yolov5
- 프로젝트 내용
    - 야구 동영상을 이용한 하이라이트 시점 태깅 알고리즘 제안
    - 투수의 투구 시점을 기준으로 다음 투구 시점을 탐색
    - 해당 투구 시점 내에 점수의 변화가 있는 경우를 로그로 기록
    - GUI 화면으로 서비스 제공
<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assetsMasterCourse/images/그림3.png" alt="시스템 구성"/>
  <br/>
  &lt;시스템 구성&gt;

  <br/>
  <img src="/assetsMasterCourse/images/그림4.png" alt="분석 결과 출력"/>
  <br/>
  &lt;분석 결과 출력&gt;
</div>
***

## 딥러닝 알고리즘 기반의 임베디드 HW용 얼굴인식 기술 모델
  
- 프로젝트 명 : 사용자 연령 및 성별 예측 맞춤 서비스
    - 기간 : 2020.08 ~ 2020.10
- 기술
    - 언어 : Python 3.8
    - Deep learning
        - Deep Neural Network
        - Convolutional Neural Network
        - One-hot encoding
    - Machin learning
        - Classification
- Framework
    - Tensorflow 2.x
    - Keras
    - OpenCV
- 프로젝트 내용
    - 얼굴 인식 기반의 사용자 별 서비스 제공
    - 사용자의 얼굴을 인식하여 연령과 성별을 예측하고 그에 맞는 서비스를 제공
    - 10대 남,여 ~ 60대 남,여로 총 12개의 분류 클래스를 사용
<div style="text-align:center; margin:0px auto; font-size:20px;">
  <img src="/assetsMasterCourse/images/그림1.png" alt="사용자 촬영"/>
  <br/>
  &lt;사용자 촬영&gt;

  <br/>
  <img src="/assetsMasterCourse/images/그림2.png" alt="분석 결과 출력"/>
  <br/>
  &lt;분석 결과 출력&gt;
</div>