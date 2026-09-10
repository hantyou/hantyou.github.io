---
title: "Distributed GP Hyperparameter Optimization"
code: "https://github.com/hantyou/Distributed-GP-Hyperpar-Optim"
types:
  - research
  - open-source
skills:
  - Gaussian processes
  - Distributed optimization
  - Multi-agent systems
description: "Research code for fully-distributed and asynchronous Gaussian process hyperparameter optimization in multi-agent systems."
relatedPublications:
  - zhai2023distributed
---

This project is the research code behind my MSc thesis, *Distributed Gaussian Process for Multi-agent Systems*, and the resulting ICASSP 2023 paper. It asks how a network of agents can jointly fit a Gaussian process (GP) to a spatial field, such as sea-surface temperature, when no central station is available to coordinate them.

<figure class="theme-figure">
  <img class="theme-figure-light" src="/img/projects/distributed-gp-workflow.png" alt="Diagram of the thesis contributions: fully-distributed and asynchronous pxADMM variants for hyperparameter optimization, and PDMM and CON-NPAE for distributed aggregation" loading="lazy" decoding="async">
  <img class="theme-figure-dark" src="/img/projects/distributed-gp-workflow-dark.png" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <figcaption>Diagram of the work. The green blocks are the contributions; the gray blocks are future work.</figcaption>
</figure>

## The problem

A Gaussian process learns a spatial field from scattered observations, but its hyperparameters (length scale, noise, and signal variance) must be tuned globally. In a multi-agent system each agent only sees part of the field, so the standard solution, proximal alternating direction method of multipliers (pxADMM), still relies on a fusion center. That center is both a scalability bottleneck and a single point of failure.

## Fully-distributed hyperparameter optimization

Building on pxADMM, this work develops two **fully-distributed** variants that remove the central station entirely. It also introduces **asynchronous** updates so that agents with heterogeneous processing times still reach a stable solution. Simulations on synthetic fields and real GHRSST sea-surface-temperature data confirm stable convergence.

<figure class="theme-figure">
  <img class="theme-figure-light" src="/img/projects/distributed-gp-convergence.png" alt="Step-size convergence of pxADMM and its fully-distributed and asynchronous variants" loading="lazy" decoding="async">
  <img class="theme-figure-dark" src="/img/projects/distributed-gp-convergence-dark.png" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <figcaption>Step-size convergence of pxADMM and its fully-distributed, synchronous and asynchronous variants.</figcaption>
</figure>

## Aggregating agent predictions

Once the local GPs are tuned, their predictions have to be combined into one field estimate. The code covers two regimes:

- **Independent local datasets.** The product-of-experts (PoE) and Bayesian committee machine (BCM) families can be distributed with a discrete-time consensus filter. This work proposes a **primal-dual method of multipliers (PDMM)** that reaches the same aggregation in fewer iterations.
- **Correlated local datasets.** Nested pointwise aggregation of experts (NPAE) accounts for cross-correlation between agents, but its NPAE-JOR variant needs a flooding step on a complete graph. **CON-NPAE** extends it to a fully-distributed algorithm on connected graphs and outperforms independence-based methods in highly connected networks.

<figure class="theme-figure">
  <img class="theme-figure-light" src="/img/projects/distributed-gp-topology.png" alt="Full network topology and the local subgraphs that CON-NPAE aggregates over" loading="lazy" decoding="async">
  <img class="theme-figure-dark" src="/img/projects/distributed-gp-topology-dark.png" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <figcaption>CON-NPAE aggregates over local subgraphs of a connected network, so no global flooding is required.</figcaption>
</figure>

<figure class="theme-figure">
  <img class="theme-figure-light" src="/img/projects/distributed-gp-pdmm-rmse.png" alt="RMSE of predictive means and variances for DTCF- and PDMM-based aggregation versus the number of agents" loading="lazy" decoding="async">
  <img class="theme-figure-dark" src="/img/projects/distributed-gp-pdmm-rmse-dark.png" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <figcaption>PDMM-based aggregation keeps the prediction error lower than DTCF as the number of agents grows.</figcaption>
</figure>

## Outcomes

- Peer-reviewed paper: P. Zhai and R. T. Rajan, *Distributed Gaussian Process Hyperparameter Optimization for Multi-Agent Systems*, ICASSP 2023.
- MSc thesis: *Distributed Gaussian Process for Multi-agent Systems*, TU Delft, 2022, available in the [TU Delft repository](https://repository.tudelft.nl/record/uuid:332d5ea4-9757-47da-8cb7-aaf95ba4e31d).
- Open MATLAB implementation of all algorithms, released on [GitHub](https://github.com/hantyou/Distributed-GP-Hyperpar-Optim).
