(function () {
  'use strict';

  const initialize = () => {
    const japanese = document.documentElement.lang === 'ja';
    const messages = {
      "verification": "セキュリティ確認を利用できません。もう一度お試しください。",
      "verificationLater": "セキュリティ確認を利用できません。時間をおいてお試しください。",
      "question": "500文字以内で質問を入力してください。",
      "challenge": "質問する前にセキュリティ確認を完了してください。",
      "checking": "公開ナレッジベースを確認しています…",
      "unavailable": "現在、回答を取得できません。時間をおいてお試しください。",
      "sources": "参照元"
    };
    const text = (key, english) => japanese ? messages[key] : english;
    const config = window.ABAP_PUBLIC_RAG_CONFIG;
    const section = document.querySelector('[data-public-rag-section]');
    const navigation = document.querySelector('[data-public-rag-navigation]');
    const form = document.querySelector('#public-rag-form');

    if (!config || config.enabled !== true || !section || !form) return;
    if (
      config.endpoint !== 'https://app.dennisbasadre.com/api/public/rag/chat' ||
      !/^0x4[A-Za-z0-9_-]{18,198}$/.test(config.turnstileSiteKey)
    ) return;

    const question = form.querySelector('#public-rag-question');
    const language = form.querySelector('#public-rag-language');
    const submit = form.querySelector('button[type="submit"]');
    const token = form.querySelector('input[name="turnstile_token"]');
    const status = document.querySelector('#public-rag-status');
    const answerPanel = document.querySelector('#public-rag-answer');
    const answerText = answerPanel.querySelector('[data-public-rag-answer]');
    const sources = answerPanel.querySelector('[data-public-rag-sources]');
    const turnstileContainer = form.querySelector('[data-public-rag-turnstile]');
    let widgetId = null;

    section.hidden = false;
    if (navigation) navigation.hidden = false;
    question.maxLength = config.maximumQuestionCharacters;

    const setStatus = (message) => {
      status.textContent = message;
    };

    const revealElement = (element) => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const resetChallenge = () => {
      token.value = '';
      if (widgetId !== null && window.turnstile) {
        window.turnstile.reset(widgetId);
      }
    };

    const renderChallenge = () => {
      if (!window.turnstile || widgetId !== null) return;
      widgetId = window.turnstile.render(turnstileContainer, {
        sitekey: config.turnstileSiteKey,
        action: 'abap_public_rag',
        language: japanese ? 'ja' : 'en',
        callback: (value) => {
          token.value = value;
          setStatus('');
        },
        'expired-callback': resetChallenge,
        'error-callback': () => {
          token.value = '';
          setStatus(text('verification', 'Security verification is unavailable. Please try again.'));
        }
      });
    };

    window.abapPublicRagTurnstileReady = renderChallenge;
    const challengeScript = document.createElement('script');
    challengeScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=abapPublicRagTurnstileReady&render=explicit';
    challengeScript.async = true;
    challengeScript.defer = true;
    challengeScript.onerror = () => {
      setStatus(text('verificationLater', 'Security verification is unavailable. Please try again later.'));
    };
    document.head.append(challengeScript);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const cleanQuestion = question.value.trim();
      if (!cleanQuestion || cleanQuestion.length > config.maximumQuestionCharacters) {
        setStatus(text('question', 'Enter a question of up to 500 characters.'));
        question.focus();
        return;
      }
      if (!token.value) {
        setStatus(text('challenge', 'Complete the security verification before asking.'));
        return;
      }

      submit.disabled = true;
      answerPanel.hidden = true;
      answerText.textContent = '';
      sources.replaceChildren();
      setStatus(text('checking', 'Checking the public knowledge base…'));
      revealElement(status);

      try {
        const response = await fetch(config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: cleanQuestion,
            language: language.value,
            turnstile_token: token.value
          })
        });
        const payload = await response.json();
        if (!response.ok || typeof payload.answer !== 'string' || !Array.isArray(payload.sources)) {
          throw new Error('safe-public-rag-failure');
        }

        answerText.textContent = payload.answer;
        if (payload.sources.length) {
          const heading = document.createElement('h4');
          heading.textContent = text('sources', 'Sources');
          const list = document.createElement('ul');
          payload.sources.forEach((source) => {
            if (!source || typeof source.title !== 'string' || typeof source.heading !== 'string') return;
            const item = document.createElement('li');
            item.textContent = `${source.title} — ${source.heading}`;
            list.append(item);
          });
          sources.append(heading, list);
        }
        answerPanel.hidden = false;
        setStatus('');
        answerPanel.focus({ preventScroll: true });
        revealElement(answerPanel);
      } catch (_error) {
        setStatus(text('unavailable', 'An answer is not available right now. Please try again later.'));
        revealElement(status);
      } finally {
        submit.disabled = false;
        resetChallenge();
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
