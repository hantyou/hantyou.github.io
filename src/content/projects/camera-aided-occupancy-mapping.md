---
title: "Camera-aided occupancy-grid mapping"
selected: true
fromDate: "2025-01"
toDate: "2026-02"
types:
  - research
parentProject: "spear"
timelineLabel: "2026 · Camera priors"
timelineOrder: 2
skills:
  - Occupancy grid mapping
  - Camera sensing
  - Sparse Bayesian learning
description: "Using camera-derived prior information to improve automotive occupancy-grid mapping."
researchQuestion: "How can camera observations provide reliable prior information when automotive radar must estimate occupied space?"
contribution: "Introduces camera-aided binary priors that strengthen occupancy-grid estimates while retaining the radar-centric mapping pipeline."
relatedPublications:
  - zhai2026camera
---

This research strand sits within SPEAR's multimodal sensing sub-project. It adds a camera to the radar mapping pipeline and treats the camera's map estimate as deliberately unreliable side information, so the mapping algorithm can accept it where it agrees with the radar and ignore it where it does not.

## The problem

Sparse Bayesian learning recovers an occupancy map from radar point clouds, but radar detections are sparse and noisy. A camera offers rich semantic context about where objects probably are, yet its depth estimate is weak: a YOLO box projected onto the ground plane can be badly placed. Trusting that prior blindly would corrupt the map, while ignoring it wastes useful information.

## Camera-aided binary prior support

The paper extracts a prior occupancy support map from camera images using YOLO object detection, then designs a sparse Bayesian learning mapping algorithm with a modified hierarchical model to incorporate it. A two-set hyperprior learns where the prior agrees with the radar measurements and down-weights it where the measurements disagree, so the camera acts as support information rather than ground truth.

<figure class="theme-figure">
  <img class="theme-figure-light" src="/img/projects/camera-aided-overview.webp" alt="Camera-aided occupancy-grid mapping pipeline: YOLO target detection and depth information produce prior support, which a sparse Bayesian mapping step combines with radar point clouds to produce the grid map." loading="lazy" decoding="async">
  <img class="theme-figure-dark" src="/img/projects/camera-aided-overview-dark.webp" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <figcaption>The camera-aided mapping pipeline. Camera detections and depth yield a prior support map that informs a sparse Bayesian occupancy-grid estimator built on radar point clouds.</figcaption>
</figure>

## Results

Experiments on nuScenes and RADIATE show better target detection and scatter-noise reduction than the state of the art. On nuScenes the camera-aided method (PSI-OGM) raises the median detection rate to 0.782, versus 0.667 for PCSBL and 0.626 for SBL, and lowers AS-NMSE to 0.007 from 0.014 and 0.011. Notably, YOLO is trained only on nuScenes camera images, yet the method still transfers to RADIATE.

<figure class="theme-figure">
  <img class="theme-figure-light" src="/img/projects/camera-aided-results.png" alt="Box plots of detection rate and AS-NMSE for PCSBL, SBL and the camera-aided PSI-OGM method on nuScenes." loading="lazy" decoding="async">
  <img class="theme-figure-dark" src="/img/projects/camera-aided-results-dark.png" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <figcaption>Camera-aided mapping (PSI-OGM) improves the median detection rate and reduces AS-NMSE relative to the sparse Bayesian baselines PCSBL and SBL on nuScenes.</figcaption>
</figure>
