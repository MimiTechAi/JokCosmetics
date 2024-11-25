import { ProgressData } from '@/types/ai';
import { AnalysisResult } from '@/types/sustainability';

class ProgressTracker {
  private static instance: ProgressTracker;
  private progress: ProgressData;

  private constructor() {
    // Lade gespeicherten Fortschritt oder initialisiere neu
    const savedProgress = localStorage.getItem('sustainability_progress');
    this.progress = savedProgress ? JSON.parse(savedProgress) : this.getInitialProgress();
  }

  public static getInstance(): ProgressTracker {
    if (!ProgressTracker.instance) {
      ProgressTracker.instance = new ProgressTracker();
    }
    return ProgressTracker.instance;
  }

  private getInitialProgress(): ProgressData {
    return {
      total_analyses: 0,
      improved_products: 0,
      average_score: 0,
      total_co2_saved: '0kg',
      total_water_saved: '0L',
      total_waste_reduced: '0kg',
      last_analysis: new Date().toISOString()
    };
  }

  public updateProgress(result: AnalysisResult): void {
    // Aktualisiere Statistiken
    this.progress.total_analyses++;
    if (result.score >= 80) {
      this.progress.improved_products++;
    }

    // Berechne neuen Durchschnitt
    const totalScore = this.progress.average_score * (this.progress.total_analyses - 1) + result.score;
    this.progress.average_score = totalScore / this.progress.total_analyses;

    // Aktualisiere Einsparungen
    this.updateSavings(result.impact);
    
    this.progress.last_analysis = new Date().toISOString();

    // Speichere Fortschritt
    this.saveProgress();
  }

  private updateSavings(impact: { co2: string; water: string; waste: string }): void {
    // Extrahiere numerische Werte und addiere sie zu den Gesamtwerten
    const co2Value = parseFloat(impact.co2) || 0;
    const waterValue = parseFloat(impact.water) || 0;
    const wasteValue = parseFloat(impact.waste) || 0;

    const currentCo2 = parseFloat(this.progress.total_co2_saved) || 0;
    const currentWater = parseFloat(this.progress.total_water_saved) || 0;
    const currentWaste = parseFloat(this.progress.total_waste_reduced) || 0;

    this.progress.total_co2_saved = `${(currentCo2 + co2Value).toFixed(1)}kg`;
    this.progress.total_water_saved = `${(currentWater + waterValue).toFixed(1)}L`;
    this.progress.total_waste_reduced = `${(currentWaste + wasteValue).toFixed(1)}kg`;
  }

  private saveProgress(): void {
    localStorage.setItem('sustainability_progress', JSON.stringify(this.progress));
  }

  public getProgress(): ProgressData {
    return { ...this.progress };
  }

  public resetProgress(): void {
    this.progress = this.getInitialProgress();
    this.saveProgress();
  }
}

export const progressTracker = ProgressTracker.getInstance();