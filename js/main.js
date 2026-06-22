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

      // Limpa as opções de parcelamento caso existam e gera de 2x a 21x
      elInstallments.innerHTML = '';
      for (let i = 2; i <= 21; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.text = `Crédito ${i}x`;
            if (i === 12) option.selected = true; // Mantém 12x como padrão
            elInstallments.appendChild(option);
      }

      // BANCO DE DADOS DE TAXAS
      const ratesTable = {

            // ================== MEGA+ (PESSOA FÍSICA) ==================
            "mega_promo": {
                  "instantly": {
                        "master_visa": { pix: 0.00, debit: 0.57, credit: 0.57, installment: { 2: 3.97, 3: 3.97, 4: 4.97, 5: 5.97, 6: 6.97, 7: 7.97, 8: 7.97, 9: 7.97, 10: 7.97, 11: 7.97, 12: 7.97, 13: 14.87, 14: 14.87, 15: 14.87, 16: 14.87, 17: 14.87, 18: 14.87, 19: 14.87, 20: 14.87, 21: 14.87 } },
                        "elo_amex": { pix: 0.00, debit: 2.57, credit: 4.34, installment: { 2: 7.02, 3: 7.58, 4: 8.38, 5: 9.38, 6: 10.38, 7: 10.98, 8: 11.38, 9: 12.38, 10: 12.88, 11: 13.74, 12: 13.78, 13: 14.87, 14: 15.51, 15: 16.15, 16: 16.79, 17: 17.43, 18: 18.07, 19: 18.71, 20: 19.35, 21: 19.99 } }
                  },
                  "1_day": {
                        "master_visa": { pix: 0.00, debit: 0.57, credit: 0.57, installment: { 2: 3.97, 3: 3.97, 4: 4.97, 5: 5.97, 6: 6.97, 7: 7.97, 8: 7.97, 9: 7.97, 10: 7.97, 11: 7.97, 12: 7.97, 13: 14.87, 14: 14.87, 15: 14.87, 16: 14.87, 17: 14.87, 18: 14.87, 19: 14.87, 20: 14.87, 21: 14.87 } },
                        "elo_amex": { pix: 0.00, debit: 2.57, credit: 4.34, installment: { 2: 7.02, 3: 7.58, 4: 8.38, 5: 9.38, 6: 10.38, 7: 10.98, 8: 11.38, 9: 12.38, 10: 12.88, 11: 13.74, 12: 13.78, 13: 14.87, 14: 15.51, 15: 16.15, 16: 16.79, 17: 17.43, 18: 18.07, 19: 18.71, 20: 19.35, 21: 19.99 } }
                  }
            },
            "mega_ate_3k": {
                  "instantly": {
                        "master_visa": { pix: 0.00, debit: 1.98, credit: 4.86, installment: { 2: 10.86, 3: 12.24, 4: 13.59, 5: 14.92, 6: 16.22, 7: 17.50, 8: 18.76, 9: 19.99, 10: 21.19, 11: 21.39, 12: 21.39, 13: 22.03, 14: 22.67, 15: 23.31, 16: 23.95, 17: 24.59, 18: 25.23, 19: 25.87, 20: 26.51, 21: 27.15 } },
                        "elo_amex": { pix: 0.00, debit: 3.27, credit: 6.15, installment: { 2: 12.30, 3: 13.68, 4: 15.03, 5: 16.36, 6: 17.66, 7: 18.94, 8: 20.20, 9: 21.43, 10: 22.78, 11: 23.64, 12: 23.68, 13: 24.32, 14: 24.96, 15: 25.60, 16: 26.24, 17: 26.88, 18: 27.52, 19: 28.16, 20: 28.80, 21: 29.44 } }
                  },
                  "1_day": {
                        "master_visa": { pix: 0.00, debit: 1.69, credit: 3.86, installment: { 2: 9.86, 3: 11.24, 4: 12.59, 5: 13.92, 6: 15.22, 7: 16.50, 8: 17.76, 9: 18.99, 10: 20.19, 11: 20.39, 12: 20.39, 13: 21.03, 14: 21.67, 15: 22.31, 16: 22.95, 17: 23.59, 18: 24.23, 19: 24.87, 20: 25.51, 21: 26.15 } },
                        "elo_amex": { pix: 0.00, debit: 2.98, credit: 5.15, installment: { 2: 11.30, 3: 12.68, 4: 14.03, 5: 15.36, 6: 16.66, 7: 17.94, 8: 19.20, 9: 20.43, 10: 21.78, 11: 22.64, 12: 22.68, 13: 23.32, 14: 23.96, 15: 24.60, 16: 25.24, 17: 25.88, 18: 26.52, 19: 27.16, 20: 27.80, 21: 28.44 } }
                  }
            },
            "mega_3k_6k": {
                  "instantly": {
                        "master_visa": { pix: 0.00, debit: 1.43, credit: 3.36, installment: { 2: 7.38, 3: 8.97, 4: 9.63, 5: 10.50, 6: 11.18, 7: 12.19, 8: 13.04, 9: 13.07, 10: 13.12, 11: 13.17, 12: 13.22, 13: 13.86, 14: 14.50, 15: 15.14, 16: 15.78, 17: 16.42, 18: 17.06, 19: 17.70, 20: 18.34, 21: 18.98 } },
                        "elo_amex": { pix: 0.00, debit: 2.72, credit: 4.65, installment: { 2: 8.82, 3: 10.41, 4: 11.07, 5: 11.94, 6: 12.62, 7: 13.63, 8: 14.48, 9: 14.51, 10: 14.71, 11: 15.42, 12: 15.51, 13: 16.15, 14: 16.79, 15: 17.43, 16: 18.07, 17: 18.71, 18: 19.35, 19: 19.99, 20: 20.63, 21: 21.27 } }
                  },
                  "1_day": {
                        "master_visa": { pix: 0.00, debit: 1.39, credit: 3.34, installment: { 2: 7.29, 3: 8.35, 4: 9.23, 5: 10.10, 6: 10.85, 7: 10.90, 8: 10.95, 9: 11.00, 10: 11.05, 11: 11.73, 12: 12.38, 13: 13.02, 14: 13.66, 15: 14.30, 16: 14.94, 17: 15.58, 18: 16.22, 19: 16.86, 20: 17.50, 21: 18.14 } },
                        "elo_amex": { pix: 0.00, debit: 2.68, credit: 4.63, installment: { 2: 8.73, 3: 9.79, 4: 10.67, 5: 11.54, 6: 12.29, 7: 12.34, 8: 12.39, 9: 12.44, 10: 12.64, 11: 13.98, 12: 14.67, 13: 15.31, 14: 15.95, 15: 16.59, 16: 17.23, 17: 17.87, 18: 18.51, 19: 19.15, 20: 19.79, 21: 20.43 } }
                  }
            },
            "mega_6k_10k": {
                  "instantly": {
                        "master_visa": { pix: 0.00, debit: 1.34, credit: 3.31, installment: { 2: 7.18, 3: 8.56, 4: 9.44, 5: 10.31, 6: 11.17, 7: 12.00, 8: 12.50, 9: 12.55, 10: 12.58, 11: 12.61, 12: 12.66, 13: 13.30, 14: 13.94, 15: 14.58, 16: 15.22, 17: 15.86, 18: 16.50, 19: 17.14, 20: 17.78, 21: 18.42 } },
                        "elo_amex": { pix: 0.00, debit: 2.63, credit: 4.60, installment: { 2: 8.62, 3: 10.00, 4: 10.88, 5: 11.75, 6: 12.61, 7: 13.44, 8: 13.94, 9: 13.99, 10: 14.17, 11: 14.86, 12: 14.95, 13: 15.59, 14: 16.23, 15: 16.87, 16: 17.51, 17: 18.15, 18: 18.79, 19: 19.43, 20: 20.07, 21: 20.71 } }
                  },
                  "1_day": {
                        "master_visa": { pix: 0.00, debit: 1.32, credit: 3.25, installment: { 2: 6.69, 3: 7.76, 4: 8.64, 5: 9.51, 6: 10.37, 7: 10.87, 8: 10.92, 9: 10.97, 10: 11.02, 11: 11.70, 12: 12.35, 13: 12.99, 14: 13.63, 15: 14.27, 16: 14.91, 17: 15.55, 18: 16.19, 19: 16.83, 20: 17.47, 21: 18.11 } },
                        "elo_amex": { pix: 0.00, debit: 2.61, credit: 4.54, installment: { 2: 8.13, 3: 9.20, 4: 10.08, 5: 10.95, 6: 11.81, 7: 12.31, 8: 12.36, 9: 12.41, 10: 12.61, 11: 13.95, 12: 14.64, 13: 15.28, 14: 15.92, 15: 16.56, 16: 17.20, 17: 17.84, 18: 18.48, 19: 19.12, 20: 19.76, 21: 20.40 } }
                  }
            },
            "mega_10k_30k": {
                  "instantly": {
                        "master_visa": { pix: 0.00, debit: 1.25, credit: 3.05, installment: { 2: 6.59, 3: 8.19, 4: 8.89, 5: 9.76, 6: 11.10, 7: 11.68, 8: 11.73, 9: 11.78, 10: 11.83, 11: 11.88, 12: 11.95, 13: 12.59, 14: 13.23, 15: 13.87, 16: 14.51, 17: 15.15, 18: 15.79, 19: 16.43, 20: 17.07, 21: 17.71 } },
                        "elo_amex": { pix: 0.00, debit: 2.54, credit: 4.34, installment: { 2: 8.03, 3: 9.63, 4: 10.33, 5: 11.20, 6: 12.54, 7: 13.12, 8: 13.17, 9: 13.22, 10: 13.42, 11: 14.13, 12: 14.24, 13: 14.88, 14: 15.52, 15: 16.16, 16: 16.80, 17: 17.44, 18: 18.08, 19: 18.72, 20: 19.36, 21: 20.00 } }
                  },
                  "1_day": {
                        "master_visa": { pix: 0.00, debit: 1.22, credit: 3.02, installment: { 2: 5.38, 3: 6.11, 4: 7.84, 5: 8.56, 6: 9.27, 7: 9.98, 8: 10.68, 9: 10.94, 10: 10.99, 11: 11.67, 12: 11.73, 13: 12.37, 14: 13.01, 15: 13.65, 16: 14.29, 17: 14.93, 18: 15.57, 19: 16.21, 20: 16.85, 21: 17.49 } },
                        "elo_amex": { pix: 0.00, debit: 2.51, credit: 4.31, installment: { 2: 6.82, 3: 7.55, 4: 9.28, 5: 10.00, 6: 10.71, 7: 11.42, 8: 12.12, 9: 12.38, 10: 12.58, 11: 13.92, 12: 14.02, 13: 14.66, 14: 15.30, 15: 15.94, 16: 16.58, 17: 17.22, 18: 17.86, 19: 18.50, 20: 19.14, 21: 19.78 } }
                  }
            },
            "mega_acima_30k": {
                  "instantly": {
                        "master_visa": { pix: 0.00, debit: 1.22, credit: 2.91, installment: { 2: 6.54, 3: 8.14, 4: 8.84, 5: 9.71, 6: 10.79, 7: 10.84, 8: 10.89, 9: 10.94, 10: 10.99, 11: 11.63, 12: 11.73, 13: 12.37, 14: 13.01, 15: 13.65, 16: 14.29, 17: 14.93, 18: 15.57, 19: 16.21, 20: 16.85, 21: 17.49 } },
                        "elo_amex": { pix: 0.00, debit: 2.51, credit: 4.20, installment: { 2: 7.98, 3: 9.58, 4: 10.28, 5: 11.15, 6: 12.23, 7: 12.28, 8: 12.33, 9: 12.38, 10: 12.58, 11: 13.88, 12: 14.02, 13: 14.66, 14: 15.30, 15: 15.94, 16: 16.58, 17: 17.22, 18: 17.86, 19: 18.50, 20: 19.14, 21: 19.78 } }
                  },
                  "1_day": {
                        "master_visa": { pix: 0.00, debit: 1.19, credit: 2.85, installment: { 2: 5.33, 3: 6.06, 4: 7.79, 5: 8.51, 6: 9.22, 7: 9.93, 8: 10.63, 9: 10.91, 10: 10.96, 11: 11.46, 12: 11.51, 13: 12.15, 14: 12.79, 15: 13.43, 16: 14.07, 17: 14.71, 18: 15.35, 19: 15.99, 20: 16.63, 21: 17.27 } },
                        "elo_amex": { pix: 0.00, debit: 2.48, credit: 4.14, installment: { 2: 6.77, 3: 7.50, 4: 9.23, 5: 9.95, 6: 10.66, 7: 11.37, 8: 12.07, 9: 12.35, 10: 12.55, 11: 13.71, 12: 13.80, 13: 14.44, 14: 15.08, 15: 15.72, 16: 16.36, 17: 17.00, 18: 17.64, 19: 18.28, 20: 18.92, 21: 19.56 } }
                  }
            },

            // ================== TON BLACK (PESSOA JURÍDICA) ==================
            // As taxas "Na Hora" do Black são iguais para todos os faturamentos.
            "black_ate_20k": {
                  "instantly": {
                        "master_visa": { pix: 0.00, debit: 2.28, credit: 5.48, installment: { 2: 10.88, 3: 11.98, 4: 12.58, 5: 13.28, 6: 13.98, 7: 14.98, 8: 15.58, 9: 16.18, 10: 16.88, 11: 17.88, 12: 18.28, 13: 21.28, 14: 22.13, 15: 23.02, 16: 23.94, 17: 24.89, 18: 25.89, 19: 26.53, 20: 27.17, 21: 27.81 } },
                        "elo_amex": { pix: 0.00, debit: 2.28, credit: 5.48, installment: { 2: 10.88, 3: 11.98, 4: 12.58, 5: 13.28, 6: 13.98, 7: 14.98, 8: 15.58, 9: 16.18, 10: 16.88, 11: 17.88, 12: 18.28, 13: 21.28, 14: 22.13, 15: 23.02, 16: 23.94, 17: 24.89, 18: 25.89, 19: 26.53, 20: 27.17, 21: 27.81 } }
                  },
                  "1_day": {
                        "master_visa": { pix: 0.00, debit: 1.36, credit: 3.14, installment: { 2: 5.38, 3: 6.11, 4: 6.84, 5: 7.56, 6: 8.27, 7: 8.98, 8: 9.68, 9: 10.37, 10: 11.05, 11: 11.73, 12: 12.39, 13: 15.39, 14: 16.01, 15: 16.65, 16: 17.31, 17: 18.00, 18: 18.72, 19: 19.36, 20: 20.00, 21: 20.64 } },
                        "elo_amex": { pix: 0.00, debit: 2.57, credit: 4.90, installment: { 2: 6.46, 3: 7.19, 4: 7.91, 5: 8.62, 6: 9.32, 7: 10.02, 8: 10.71, 9: 11.40, 10: 12.07, 11: 12.74, 12: 13.40, 13: 16.40, 14: 17.06, 15: 17.74, 16: 18.45, 17: 19.19, 18: 19.95, 19: 20.59, 20: 21.23, 21: 21.87 } }
                  }
            },
            "black_20k_40k": {
                  "instantly": {
                        "master_visa": { pix: 0.00, debit: 2.28, credit: 5.48, installment: { 2: 10.88, 3: 11.98, 4: 12.58, 5: 13.28, 6: 13.98, 7: 14.98, 8: 15.58, 9: 16.18, 10: 16.88, 11: 17.88, 12: 18.28, 13: 21.28, 14: 22.13, 15: 23.02, 16: 23.94, 17: 24.89, 18: 25.89, 19: 26.53, 20: 27.17, 21: 27.81 } },
                        "elo_amex": { pix: 0.00, debit: 2.28, credit: 5.48, installment: { 2: 10.88, 3: 11.98, 4: 12.58, 5: 13.28, 6: 13.98, 7: 14.98, 8: 15.58, 9: 16.18, 10: 16.88, 11: 17.88, 12: 18.28, 13: 21.28, 14: 22.13, 15: 23.02, 16: 23.94, 17: 24.89, 18: 25.89, 19: 26.53, 20: 27.17, 21: 27.81 } }
                  },
                  "1_day": {
                        "master_visa": { pix: 0.00, debit: 0.84, credit: 2.88, installment: { 2: 4.21, 3: 4.82, 4: 5.43, 5: 6.04, 6: 6.63, 7: 7.23, 8: 7.81, 9: 8.40, 10: 8.97, 11: 9.55, 12: 10.11, 13: 13.11, 14: 13.63, 15: 14.18, 16: 14.75, 17: 15.34, 18: 15.95, 19: 16.59, 20: 17.23, 21: 17.87 } },
                        "elo_amex": { pix: 0.00, debit: 2.07, credit: 4.64, installment: { 2: 6.08, 3: 6.68, 4: 7.27, 5: 7.86, 6: 8.45, 7: 9.04, 8: 9.62, 9: 10.19, 10: 10.75, 11: 11.32, 12: 11.87, 13: 14.87, 14: 15.46, 15: 16.08, 16: 16.73, 17: 17.40, 18: 18.09, 19: 18.73, 20: 19.37, 21: 20.01 } }
                  }
            },
            "black_40k_80k": {
                  "instantly": {
                        "master_visa": { pix: 0.00, debit: 2.28, credit: 5.48, installment: { 2: 10.88, 3: 11.98, 4: 12.58, 5: 13.28, 6: 13.98, 7: 14.98, 8: 15.58, 9: 16.18, 10: 16.88, 11: 17.88, 12: 18.28, 13: 21.28, 14: 22.13, 15: 23.02, 16: 23.94, 17: 24.89, 18: 25.89, 19: 26.53, 20: 27.17, 21: 27.81 } },
                        "elo_amex": { pix: 0.00, debit: 2.28, credit: 5.48, installment: { 2: 10.88, 3: 11.98, 4: 12.58, 5: 13.28, 6: 13.98, 7: 14.98, 8: 15.58, 9: 16.18, 10: 16.88, 11: 17.88, 12: 18.28, 13: 21.28, 14: 22.13, 15: 23.02, 16: 23.94, 17: 24.89, 18: 25.89, 19: 26.53, 20: 27.17, 21: 27.81 } }
                  },
                  "1_day": {
                        "master_visa": { pix: 0.00, debit: 0.78, credit: 2.78, installment: { 2: 4.07, 3: 4.64, 4: 5.20, 5: 5.76, 6: 6.31, 7: 6.86, 8: 7.41, 9: 7.95, 10: 8.48, 11: 9.02, 12: 9.55, 13: 12.55, 14: 13.05, 15: 13.57, 16: 14.12, 17: 14.68, 18: 15.27, 19: 15.91, 20: 16.55, 21: 17.19 } },
                        "elo_amex": { pix: 0.00, debit: 1.97, credit: 4.55, installment: { 2: 5.94, 3: 6.49, 4: 7.04, 5: 7.59, 6: 8.14, 7: 8.68, 8: 9.22, 9: 9.75, 10: 10.28, 11: 10.80, 12: 11.32, 13: 14.32, 14: 14.89, 15: 15.49, 16: 16.11, 17: 16.75, 18: 17.42, 19: 18.06, 20: 18.70, 21: 19.34 } }
                  }
            },
            "black_acima_80k": {
                  "instantly": {
                        "master_visa": { pix: 0.00, debit: 2.28, credit: 5.48, installment: { 2: 10.88, 3: 11.98, 4: 12.58, 5: 13.28, 6: 13.98, 7: 14.98, 8: 15.58, 9: 16.18, 10: 16.88, 11: 17.88, 12: 18.28, 13: 21.28, 14: 22.13, 15: 23.02, 16: 23.94, 17: 24.89, 18: 25.89, 19: 26.53, 20: 27.17, 21: 27.81 } },
                        "elo_amex": { pix: 0.00, debit: 2.28, credit: 5.48, installment: { 2: 10.88, 3: 11.98, 4: 12.58, 5: 13.28, 6: 13.98, 7: 14.98, 8: 15.58, 9: 16.18, 10: 16.88, 11: 17.88, 12: 18.28, 13: 21.28, 14: 22.13, 15: 23.02, 16: 23.94, 17: 24.89, 18: 25.89, 19: 26.53, 20: 27.17, 21: 27.81 } }
                  },
                  "1_day": {
                        "master_visa": { pix: 0.00, debit: 0.74, credit: 2.68, installment: { 2: 3.93, 3: 4.45, 4: 4.97, 5: 5.48, 6: 5.98, 7: 6.50, 8: 6.98, 9: 7.50, 10: 7.98, 11: 8.48, 12: 8.98, 13: 11.98, 14: 12.46, 15: 12.96, 16: 13.48, 17: 14.01, 18: 14.58, 19: 15.22, 20: 15.86, 21: 16.50 } },
                        "elo_amex": { pix: 0.00, debit: 1.87, credit: 4.45, installment: { 2: 5.80, 3: 6.31, 4: 6.82, 5: 7.32, 6: 7.82, 7: 8.33, 8: 8.82, 9: 9.31, 10: 9.80, 11: 10.28, 12: 10.76, 13: 13.76, 14: 14.31, 15: 14.88, 16: 15.48, 17: 16.10, 18: 16.74, 19: 17.38, 20: 18.02, 21: 18.66 } }
                  }
            }
      };

      // Formata números para o padrão Moeda R$
      function formatCurrency(value) {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      }

      // Função Mestre de Cálculo
      function calculateSimulation() {
            let saleValue = parseFloat(elValue.value);
            let plan = elPlan.value;
            let receipt = elReceipt.value;
            let brand = elBrand.value;
            let selectedInstallment = parseInt(elInstallments.value);

            elValueDisplay.textContent = formatCurrency(saleValue);

            // Segurança para evitar quebra do script se o plano não for encontrado
            if (!ratesTable[plan]) {
                  console.warn("Aviso: Plano '" + plan + "' não encontrado no JavaScript.");
                  return;
            }

            let rates = ratesTable[plan][receipt][brand];
            let currentInstallmentRate = rates.installment[selectedInstallment];

            let netPix = saleValue - (saleValue * (rates.pix / 100));
            let netDebit = saleValue - (saleValue * (rates.debit / 100));
            let netCredit = saleValue - (saleValue * (rates.credit / 100));
            let netInstallment = saleValue - (saleValue * (currentInstallmentRate / 100));

            // Atualiza os percentuais (%) na tela do simulador
            txPix.textContent = rates.pix.toFixed(2).replace('.', ',') + '%';
            txDebit.textContent = rates.debit.toFixed(2).replace('.', ',') + '%';
            txCredit.textContent = rates.credit.toFixed(2).replace('.', ',') + '%';
            txInstallment.textContent = currentInstallmentRate.toFixed(2).replace('.', ',') + '%';

            // Atualiza os valores líquidos (R$) na tela do simulador
            resPix.textContent = formatCurrency(netPix);
            resDebit.textContent = formatCurrency(netDebit);
            resCredit.textContent = formatCurrency(netCredit);
            resInstallment.textContent = formatCurrency(netInstallment);
      }

      // Adiciona os eventos para recalcular ao mexer em qualquer campo
      elValue.addEventListener('input', calculateSimulation);
      elPlan.addEventListener('change', calculateSimulation);
      elReceipt.addEventListener('change', calculateSimulation);
      elBrand.addEventListener('change', calculateSimulation);
      elInstallments.addEventListener('change', calculateSimulation);

      // Inicia a calculadora no carregamento da página
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
      // 3. SMOOTH SCROLL (LINK SUAVE)
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

      // ==========================================
      // 4. LÓGICA DO BANNER DE COOKIES
      // ==========================================
      const cookieBanner = document.getElementById('cookieBanner');
      const btnAcceptCookies = document.getElementById('acceptCookies');
      const btnEssenciais = document.getElementById('btnEssenciais');

      if (cookieBanner) {
            // Se o usuário ainda não tiver aceitado os cookies no navegador atual
            if (!localStorage.getItem('cookiesAccepted')) {
                  // Remove a classe 'd-none' para o banner aparecer
                  cookieBanner.classList.remove('d-none');
            }

            // Função que esconde o banner e salva o aceite no navegador
            function closeCookieBanner() {
                  localStorage.setItem('cookiesAccepted', 'true');
                  cookieBanner.classList.add('d-none');
            }

            // Associa a função de fechar aos botões principais
            if (btnAcceptCookies) btnAcceptCookies.addEventListener('click', closeCookieBanner);
            if (btnEssenciais) btnEssenciais.addEventListener('click', closeCookieBanner);
      }

      // ==========================================
      // 5. RASTREAMENTO DE EVENTOS (FACEBOOK PIXEL)
      // ==========================================
      
      // Seleciona todos os botões de compra da página e o botão do hero
      const buyButtons = document.querySelectorAll('.btn-order, .btn-hero-cta');

      buyButtons.forEach(button => {
            button.addEventListener('click', function() {
                  // Verifica se o pixel do Facebook está ativo na página
                  if (typeof fbq === 'function') {
                        // Dispara o evento de "Iniciar Checkout"
                        fbq('track', 'InitiateCheckout');
                        console.log('Evento InitiateCheckout disparado para o Facebook!');
                  }
            });
      });
});