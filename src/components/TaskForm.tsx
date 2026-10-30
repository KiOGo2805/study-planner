export function TaskForm() {
  return (
    <form className="task-form">
      <div className="task-form__group">
        <input type="text" placeholder="Назва завдання" className="task-form__input" />
      </div>
      <button type="submit" className="task-form__submit">Додати</button>
    </form>
  );
}
