document.addEventListener("DOMContentLoaded", function () {

      // ==========================================
      // 1. SALES SIMULATOR LOGIC
      // ==========================================
      const elValue = document.getElementById('sim-value');
      const elValueDisplay = document.getElementById('value-display');
      const elPlan = document.getElementById('sim-plan');
      const elReceipt = document.getElementById('sim-receipt');
      const elBrand = document.getElementById('sim-brand');
      const elInstallments = document.getElementById('sim-installments');

      const txPix = document.getElementById('rate-pix');
      const resPix = document.getElementById('receive-pix');
      const txDebit = document.getElementById('rate-debit');
      const resDebit = document.getElementById('receive-debit');
      const txCredit = document.getElementById('rate-credit');
      const resCredit = document.getElementById('receive-credit');
      const txInstallment = document.getElementById('rate-installments');
      const resInstallment = document.getElementById('receive-installments');

      // Generates the installment options menu (2x to 18x)
      for (let i = 2; i <= 18; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.text = `Crédito ${i}x`;
            if (i === 12) option.selected = true; // Keeps 12x selected by default
            elInstallments.appendChild(option);
      }

      // RATES LIST
      const ratesTable = {
            "promotional": {
                  "instantly": {
                        "master_visa": {
                              pix: 0.00, debit: 0.57, credit: 0.57,
                              installment: { 2: 3.97, 3: 3.97, 4: 4.97, 5: 5.97, 6: 6.97, 7: 7.97, 8: 7.97, 9: 7.97, 10: 7.97, 11: 7.97, 12: 7.97, 13: 14.87, 14: 14.87, 15: 14.87, 16: 14.87, 17: 14.87, 18: 14.87 }
                        },
                        "elo_amex": {
                              pix: 0.00, debit: 2.57, credit: 4.34,
                              installment: { 2: 7.02, 3: 7.58, 4: 8.38, 5: 9.38, 6: 10.38, 7: 10.98, 8: 11.38, 9: 12.38, 10: 12.88, 11: 13.74, 12: 13.78, 13: 14.87, 14: 15.51, 15: 16.15, 16: 16.79, 17: 17.43, 18: 18.07 }
                        }
                  },
                  "1_day": {
                        "master_visa": {
                              pix: 0.00, debit: 0.57, credit: 0.57,
                              installment: { 2: 3.97, 3: 3.97, 4: 4.97, 5: 5.97, 6: 6.97, 7: 7.97, 8: 7.97, 9: 7.97, 10: 7.97, 11: 7.97, 12: 7.97, 13: 14.87, 14: 14.87, 15: 14.87, 16: 14.87, 17: 14.87, 18: 14.87 }
                        },
                        "elo_amex": {
                              pix: 0.00, debit: 2.57, credit: 4.34,
                              installment: { 2: 7.02, 3: 7.58, 4: 8.38, 5: 9.38, 6: 10.38, 7: 10.98, 8: 11.38, 9: 12.38, 10: 12.88, 11: 13.74, 12: 13.78, 13: 14.87, 14: 15.51, 15: 16.15, 16: 16.79, 17: 17.43, 18: 18.07 }
                        }
                  }
            },
            "up_to_3k": {
                  "instantly": {
                        "master_visa": {
                              pix: 0.00, debit: 1.98, credit: 4.86,
                              installment: { 2: 10.86, 3: 12.24, 4: 13.59, 5: 14.92, 6: 16.22, 7: 17.50, 8: 18.76, 9: 19.99, 10: 21.19, 11: 21.39, 12: 21.39, 13: 22.03, 14: 22.67, 15: 23.31, 16: 23.95, 17: 24.59, 18: 25.23 }
                        },
                        "elo_amex": {
                              pix: 0.00, debit: 3.27, credit: 6.15,
                              installment: { 2: 12.30, 3: 13.68, 4: 15.03, 5: 16.36, 6: 17.66, 7: 18.94, 8: 20.20, 9: 21.43, 10: 22.78, 11: 23.64, 12: 23.68, 13: 24.32, 14: 24.96, 15: 25.60, 16: 26.24, 17: 26.88, 18: 27.52 }
                        }
                  },
                  "1_day": {
                        "master_visa": {
                              pix: 0.00, debit: 1.69, credit: 3.86,
                              installment: { 2: 9.86, 3: 11.24, 4: 12.59, 5: 13.92, 6: 15.22, 7: 16.50, 8: 17.76, 9: 18.99, 10: 20.19, 11: 20.39, 12: 20.39, 13: 21.03, 14: 21.67, 15: 22.31, 16: 22.95, 17: 23.59, 18: 24.23 }
                        },
                        "elo_amex": {
                              pix: 0.00, debit: 2.98, credit: 5.15,
                              installment: { 2: 11.30, 3: 12.68, 4: 14.03, 5: 15.36, 6: 16.66, 7: 17.94, 8: 19.20, 9: 20.43, 10: 21.78, 11: 22.64, 12: 22.68, 13: 23.32, 14: 23.96, 15: 24.60, 16: 25.24, 17: 25.88, 18: 26.52 }
                        }
                  }
            },
            "3k_6k": {
                  "instantly": {
                        "master_visa": {
                              pix: 0.00, debit: 1.43, credit: 3.36,
                              installment: { 2: 7.38, 3: 8.97, 4: 9.63, 5: 10.50, 6: 11.18, 7: 12.19, 8: 13.04, 9: 13.07, 10: 13.12, 11: 13.17, 12: 13.22, 13: 13.86, 14: 14.50, 15: 15.14, 16: 15.78, 17: 16.42, 18: 17.06 }
                        },
                        "elo_amex": {
                              pix: 0.00, debit: 2.72, credit: 4.65,
                              installment: { 2: 8.82, 3: 10.41, 4: 11.07, 5: 11.94, 6: 12.62, 7: 13.63, 8: 14.48, 9: 14.51, 10: 14.71, 11: 15.42, 12: 15.51, 13: 16.15, 14: 16.79, 15: 17.43, 16: 18.07, 17: 18.71, 18: 19.35 }
                        }
                  },
                  "1_day": {
                        "master_visa": {
                              pix: 0.00, debit: 1.39, credit: 3.34,
                              installment: { 2: 7.29, 3: 8.35, 4: 9.23, 5: 10.10, 6: 10.85, 7: 10.90, 8: 10.95, 9: 11.00, 10: 11.05, 11: 11.73, 12: 12.38, 13: 13.02, 14: 13.66, 15: 14.30, 16: 14.94, 17: 15.58, 18: 16.22 }
                        },
                        "elo_amex": {
                              pix: 0.00, debit: 2.68, credit: 4.63,
                              installment: { 2: 8.73, 3: 9.79, 4: 10.67, 5: 11.54, 6: 12.29, 7: 12.34, 8: 12.39, 9: 12.44, 10: 12.64, 11: 13.98, 12: 14.67, 13: 15.31, 14: 15.95, 15: 16.59, 16: 17.23, 17: 17.87, 18: 18.51 }
                        }
                  }
            },
            "6k_10k": {
                  "instantly": {
                        "master_visa": {
                              pix: 0.00, debit: 1.34, credit: 3.31,
                              installment: { 2: 7.18, 3: 8.56, 4: 9.44, 5: 10.31, 6: 11.17, 7: 12.00, 8: 12.50, 9: 12.55, 10: 12.58, 11: 12.61, 12: 12.66, 13: 13.30, 14: 13.94, 15: 14.58, 16: 15.22, 17: 15.86, 18: 16.50 }
                        },
                        "elo_amex": {
                              pix: 0.00, debit: 2.63, credit: 4.60,
                              installment: { 2: 8.62, 3: 10.00, 4: 10.88, 5: 11.75, 6: 12.61, 7: 13.44, 8: 13.94, 9: 13.99, 10: 14.17, 11: 14.86, 12: 14.95, 13: 15.59, 14: 16.23, 15: 16.87, 16: 17.51, 17: 18.15, 18: 18.79 }
                        }
                  },
                  "1_day": {
                        "master_visa": {
                              pix: 0.00, debit: 1.32, credit: 3.25,
                              installment: { 2: 6.69, 3: 7.76, 4: 8.64, 5: 9.51, 6: 10.37, 7: 10.87, 8: 10.92, 9: 10.97, 10: 11.02, 11: 11.70, 12: 12.35, 13: 12.99, 14: 13.63, 15: 14.27, 16: 14.91, 17: 15.55, 18: 16.19 }
                        },
                        "elo_amex": {
                              pix: 0.00, debit: 2.61, credit: 4.54,
                              installment: { 2: 8.13, 3: 9.20, 4: 10.08, 5: 10.95, 6: 11.81, 7: 12.31, 8: 12.36, 9: 12.41, 10: 12.61, 11: 13.95, 12: 14.64, 13: 15.28, 14: 15.92, 15: 16.56, 16: 17.20, 17: 17.84, 18: 18.48 }
                        }
                  }
            },
            "10k_30k": {
                  "instantly": {
                        "master_visa": {
                              pix: 0.00, debit: 1.25, credit: 3.05,
                              installment: { 2: 6.59, 3: 8.19, 4: 8.89, 5: 9.76, 6: 11.10, 7: 11.68, 8: 11.73, 9: 11.78, 10: 11.83, 11: 11.88, 12: 11.95, 13: 12.59, 14: 13.23, 15: 13.87, 16: 14.51, 17: 15.15, 18: 15.79 }
                        },
                        "elo_amex": {
                              pix: 0.00, debit: 2.54, credit: 4.34,
                              installment: { 2: 8.03, 3: 9.63, 4: 10.33, 5: 11.20, 6: 12.54, 7: 13.12, 8: 13.17, 9: 13.22, 10: 13.42, 11: 14.13, 12: 14.24, 13: 14.88, 14: 15.52, 15: 16.16, 16: 16.80, 17: 17.44, 18: 18.08 }
                        }
                  },
                  "1_day": {
                        "master_visa": {
                              pix: 0.00, debit: 1.22, credit: 3.02,
                              installment: { 2: 5.38, 3: 6.11, 4: 7.84, 5: 8.56, 6: 9.27, 7: 9.98, 8: 10.68, 9: 10.94, 10: 10.99, 11: 11.67, 12: 11.73, 13: 12.37, 14: 13.01, 15: 13.65, 16: 14.29, 17: 14.93, 18: 15.57 }
                        },
                        "elo_amex": {
                              pix: 0.00, debit: 2.51, credit: 4.31,
                              installment: { 2: 6.82, 3: 7.55, 4: 9.28, 5: 10.00, 6: 10.71, 7: 11.42, 8: 12.12, 9: 12.38, 10: 12.58, 11: 13.92, 12: 14.02, 13: 14.66, 14: 15.30, 15: 15.94, 16: 16.58, 17: 17.22, 18: 17.86 }
                        }
                  }
            },
            "above_30k": {
                  "instantly": {
                        "master_visa": {
                              pix: 0.00, debit: 1.22, credit: 2.91,
                              installment: { 2: 6.54, 3: 8.14, 4: 8.84, 5: 9.71, 6: 10.79, 7: 10.84, 8: 10.89, 9: 10.94, 10: 10.99, 11: 11.63, 12: 11.73, 13: 12.37, 14: 13.01, 15: 13.65, 16: 14.29, 17: 14.93, 18: 15.57 }
                        },
                        "elo_amex": {
                              pix: 0.00, debit: 2.51, credit: 4.20,
                              installment: { 2: 7.98, 3: 9.58, 4: 10.28, 5: 11.15, 6: 12.23, 7: 12.28, 8: 12.33, 9: 12.38, 10: 12.58, 11: 13.88, 12: 14.02, 13: 14.66, 14: 15.30, 15: 15.94, 16: 16.58, 17: 17.22, 18: 17.86 }
                        }
                  },
                  "1_day": {
                        "master_visa": {
                              pix: 0.00, debit: 1.19, credit: 2.85,
                              installment: { 2: 5.33, 3: 6.06, 4: 7.79, 5: 8.51, 6: 9.22, 7: 9.93, 8: 10.63, 9: 10.91, 10: 10.96, 11: 11.46, 12: 11.51, 13: 12.15, 14: 12.79, 15: 13.43, 16: 14.07, 17: 14.71, 18: 15.35 }
                        },
                        "elo_amex": {
                              pix: 0.00, debit: 2.48, credit: 4.14,
                              installment: { 2: 6.77, 3: 7.50, 4: 9.23, 5: 9.95, 6: 10.66, 7: 11.37, 8: 12.07, 9: 12.35, 10: 12.55, 11: 13.71, 12: 13.80, 13: 14.44, 14: 15.08, 15: 15.72, 16: 16.36, 17: 17.00, 17: 17.64 }
                        }
                  }
            }
      };

      function formatCurrency(value) {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      }

      function calculateSimulation() {
            let saleValue = parseFloat(elValue.value);
            let plan = elPlan.value;
            let receipt = elReceipt.value;
            let brand = elBrand.value;
            let selectedInstallment = parseInt(elInstallments.value);

            elValueDisplay.textContent = formatCurrency(saleValue);
            let rates = ratesTable[plan][receipt][brand];
            let currentInstallmentRate = rates.installment[selectedInstallment];

            let netPix = saleValue - (saleValue * (rates.pix / 100));
            let netDebit = saleValue - (saleValue * (rates.debit / 100));
            let netCredit = saleValue - (saleValue * (rates.credit / 100));
            let netInstallment = saleValue - (saleValue * (currentInstallmentRate / 100));

            txPix.textContent = rates.pix.toFixed(2).replace('.', ',') + '%';
            txDebit.textContent = rates.debit.toFixed(2).replace('.', ',') + '%';
            txCredit.textContent = rates.credit.toFixed(2).replace('.', ',') + '%';
            txInstallment.textContent = currentInstallmentRate.toFixed(2).replace('.', ',') + '%';

            resPix.textContent = formatCurrency(netPix);
            resDebit.textContent = formatCurrency(netDebit);
            resCredit.textContent = formatCurrency(netCredit);
            resInstallment.textContent = formatCurrency(netInstallment);
      }

      elValue.addEventListener('input', calculateSimulation);
      elPlan.addEventListener('change', calculateSimulation);
      elReceipt.addEventListener('change', calculateSimulation);
      elBrand.addEventListener('change', calculateSimulation);
      elInstallments.addEventListener('change', calculateSimulation);

      calculateSimulation();

      // ==========================================
      // 2. SCROLL ANIMATIONS (FADE-UP)
      // ==========================================
      const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                  if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                  }
            });
      }, { threshold: 0.12 });

      document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

      // ==========================================
      // 3. SMOOTH SCROLL (SMOOTH LINK)
      // ==========================================
      document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                  const target = document.querySelector(a.getAttribute('href'));
                  if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
            });
      });

});