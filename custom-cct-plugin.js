// Custom Columbia Card Task Plugin for Full Performance Data
// Designed to capture complete performance data from all rounds

// Make the plugin globally available using the same pattern as the original plugin
window.CustomCCTPlugin = (function(jspsych) {
  'use strict';

  const info = {
    name: 'custom-cct',
    parameters: {
      num_cards: {
        type: jspsych.ParameterType.INT,
        default: 32
      },
      num_loss_cards: {
        type: jspsych.ParameterType.INT,
        default: 3
      },
      gain_value: {
        type: jspsych.ParameterType.INT,
        default: 10
      },
      loss_value: {
        type: jspsych.ParameterType.INT,
        default: -250
      },
      hot: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      immediate_feedback: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      button_label_stop: {
        type: jspsych.ParameterType.STRING,
        default: 'END ROUND'
      }
    }
  };

  class CustomCCTPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    
    static {
      this.info = info;
    }

    trial(display_element, trial) {
    var num_cards = trial.num_cards || 32;
    var num_loss_cards = trial.num_loss_cards || 3;
    var gain_value = trial.gain_value || 10;
    var loss_value = trial.loss_value || -250;
    var hot = trial.hot || false;
    var immediate_feedback = trial.immediate_feedback || false;
    var button_label = trial.button_label_stop || 'END ROUND';

    // Create card deck
    var cards = [];
    for (var i = 0; i < num_cards; i++) {
      cards.push({
        index: i,
        is_loss: i < num_loss_cards,
        value: i < num_loss_cards ? loss_value : gain_value
      });
    }

    // Shuffle cards
    for (var i = cards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = cards[i];
      cards[i] = cards[j];
      cards[j] = temp;
    }

    var cards_clicked = [];
    var total_points = 0;
    var round_ended = false;
    var loss_hit = false;

    // Create HTML
    var html = '<div class="cct-container">';
    html += '<div class="cct-score">Points: <span id="cct-points">0</span></div>';
    html += '<div class="cct-cards">';
    
    for (var i = 0; i < num_cards; i++) {
      html += '<div class="cct-card" data-index="' + i + '" data-value="' + cards[i].value + '">';
      html += '<div class="cct-card-front">?</div>';
      html += '<div class="cct-card-back" style="display:none;">' + cards[i].value + '</div>';
      html += '</div>';
    }
    
    html += '</div>';
    html += '<div class="cct-controls">';
    html += '<button id="cct-end-round" class="cct-button">' + button_label + '</button>';
    html += '</div>';
    html += '</div>';

    // Add CSS
    var css = `
      .cct-container { text-align: center; padding: 20px; }
      .cct-score { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
      .cct-cards { display: grid; grid-template-columns: repeat(8, 1fr); gap: 10px; margin-bottom: 20px; }
      .cct-card { width: 60px; height: 80px; border: 2px solid #ccc; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; }
      .cct-card:hover { border-color: #007bff; }
      .cct-card.flipped { background-color: #f8f9fa; }
      .cct-card.loss { background-color: #ffebee; border-color: #f44336; }
      .cct-card.gain { background-color: #e8f5e8; border-color: #4caf50; }
      .cct-button { padding: 10px 20px; font-size: 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
      .cct-button:hover { background-color: #0056b3; }
    `;

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    display_element.innerHTML = html;

    // Card click handler
    function handleCardClick(event) {
      if (round_ended) return;
      
      var card = event.currentTarget;
      var index = parseInt(card.dataset.index);
      var value = parseInt(card.dataset.value);
      
      if (cards_clicked.includes(index)) return;
      
      cards_clicked.push(index);
      total_points += value;
      
      // Update display
      card.classList.add('flipped');
      card.querySelector('.cct-card-front').style.display = 'none';
      card.querySelector('.cct-card-back').style.display = 'flex';
      
      if (value < 0) {
        card.classList.add('loss');
        loss_hit = true;
      } else {
        card.classList.add('gain');
      }
      
      // Update score
      document.getElementById('cct-points').textContent = total_points;
      
      // Auto-end on loss for hot rounds
      if (hot && loss_hit) {
        endRound();
      }
    }

    // End round handler
    function endRound() {
      if (round_ended) return;
      round_ended = true;
      
      // Disable all cards
      var allCards = display_element.querySelectorAll('.cct-card');
      allCards.forEach(function(card) {
        card.style.pointerEvents = 'none';
      });
      
      // Disable button
      var button = display_element.querySelector('#cct-end-round');
      button.disabled = true;
      button.textContent = 'Round Complete';
      
      // Finish trial with complete data
      var trial_data = {
        cards_turned: cards_clicked.length,
        outcome: total_points,
        loss: loss_hit ? 1 : 0,
        gain: total_points > 0 ? total_points : 0,
        cards_clicked: cards_clicked,
        total_points: total_points,
        loss_hit: loss_hit,
        hot: hot,
        immediate_feedback: immediate_feedback
      };
      
      this.jsPsych.finishTrial(trial_data);
    }

    // Add event listeners
    var allCards = display_element.querySelectorAll('.cct-card');
    allCards.forEach(function(card) {
      card.addEventListener('click', handleCardClick);
    });

    var button = display_element.querySelector('#cct-end-round');
    button.addEventListener('click', endRound.bind(this));
    }
  }

  return CustomCCTPlugin;

})(jsPsychModule);

// Plugin is now available as window.CustomCCTPlugin
