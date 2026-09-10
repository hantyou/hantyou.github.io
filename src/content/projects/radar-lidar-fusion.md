---
title: "Radar–LiDAR fusion for occupancy mapping"
selected: true
fromDate: "2023-02"
toDate: "2025-09"
types:
  - research
parentProject: "spear"
timelineLabel: "2024–2025 · Sensor fusion"
timelineOrder: 1
skills:
  - Radar-LiDAR fusion
  - Occupancy grid mapping
  - Automotive perception
description: "Spatial sparsity-aware fusion of radar and LiDAR for automotive occupancy-grid mapping."
researchQuestion: "How can radar and LiDAR complement one another when estimating occupied space in automotive driving scenes?"
contribution: "Develops sparsity-aware sensor-fusion methods that combine radar and LiDAR information for more informative occupancy-grid maps."
relatedPublications:
  - zhai2024sparsity
  - zhai2025spatial
---

This SPEAR research strand studies feature-level radar–LiDAR fusion for binary occupancy-grid mapping in automotive driving. Radar is robust in rain, fog and darkness but its detections are sparse and noisy; LiDAR gives accurate range but degrades in adverse weather and produces ground scatter. The question is how to combine them so the map is more accurate than either sensor alone.

## The problem

Occupancy-grid mapping estimates which cells are occupied from point-cloud measurements. Obstacles only show up at their edges, so the map is mostly empty and strongly spatially sparse. Mapping with a single modality either misses detections (radar) or degrades with weather and ground returns (LiDAR), and high-level fusion cannot exploit complementary measurements at the grid level.

## Fusion as sparse reconstruction

Both the conference and journal papers model occupancy mapping as sparse binary-vector reconstruction with pattern-coupled sparse Bayesian learning (PCSBL), and introduce two feature-level measurement models for fusion:

- **Common sparse fusion (CS).** A single common map is estimated jointly from all radar and LiDAR measurements.
- **Common innovative sparse fusion (CIS).** A shared map is learned together with an innovation (error-collector) component for each modality. The error collectors absorb sensor-specific false alarms or model mismatch, so the estimate is robust to sensor mismatch, calibration errors, and inconsistencies between the two modalities.

<figure class="theme-figure theme-figure--half">
  <img class="theme-figure-light" src="/img/projects/radar-lidar-fusion-overview.webp" alt="Two feature-level fusion models: common sparse fusion estimates one map from all radar and LiDAR measurements, while common innovative sparse fusion adds an error collector per sensor and discards multimodal inconsistencies." loading="lazy" decoding="async">
  <img class="theme-figure-dark" src="/img/projects/radar-lidar-fusion-overview-dark.webp" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <figcaption>Feature-level fusion of radar and LiDAR. Common sparse fusion estimates one shared map; common innovative sparse fusion adds an error collector per modality and rejects multimodal inconsistencies.</figcaption>
</figure>

## Results

Experiments on the public RADIATE dataset show that the fused models outperform single-modality and high-level fusion baselines. The CIS model is the most robust to angular misalignment: it keeps a high detection rate and low AS-NMSE as the angle error grows, whereas LiDAR-only detection falls to 0.61 at large angle errors.

<figure class="theme-figure">
  <img class="theme-figure-light" src="/img/projects/radar-lidar-fusion-results.png" alt="Two panels plotting AS-NMSE and detection rate against angle error for LiDAR, radar, high-level OR, Bayesian, common sparse and common innovative sparse fusion." loading="lazy" decoding="async">
  <img class="theme-figure-dark" src="/img/projects/radar-lidar-fusion-results-dark.png" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <figcaption>Fusion performance under angular misalignment on RADIATE: AS-NMSE (top) and detection rate (bottom) versus angle error. Common innovative sparse fusion (CIS) stays accurate as the angle error grows, while LiDAR-only detection falls sharply.</figcaption>
</figure>
