extends Node

signal xp_changed(new_xp: int, new_level: int)
signal level_up(new_level: int)

const XP_PER_LEVEL: int = 100
const XP_PER_CHALLENGE_CORRECT: int = 10
const XP_PER_CHALLENGE_INCORRECT: int = 2
const XP_PER_LESSON_COMPLETE: int = 25
const XP_PER_UNIT_COMPLETE: int = 50

var xp: int = 0
var level: int = 1

func _ready():
	var progress = DataManager.load_progress()
	xp = progress.get("xp", 0)
	level = progress.get("level", 1)

func add_xp(amount: int) -> void:
	xp += amount
	var new_level := _calculate_level(xp)
	if new_level > level:
		level = new_level
		level_up.emit(level)
	_save()
	xp_changed.emit(xp, level)

func add_challenge_xp(correct: bool) -> void:
	if correct:
		add_xp(XP_PER_CHALLENGE_CORRECT)
	else:
		add_xp(XP_PER_CHALLENGE_INCORRECT)

func add_lesson_complete_xp() -> void:
	add_xp(XP_PER_LESSON_COMPLETE)

func add_unit_complete_xp() -> void:
	add_xp(XP_PER_UNIT_COMPLETE)

func _calculate_level(total_xp: int) -> int:
	return (total_xp / XP_PER_LEVEL) + 1

func get_xp_for_next_level() -> int:
	var remainder := xp % XP_PER_LEVEL
	return XP_PER_LEVEL - remainder

func get_level_progress() -> float:
	return float(xp % XP_PER_LEVEL) / float(XP_PER_LEVEL)

func _save() -> void:
	var progress = DataManager.load_progress()
	progress["xp"] = xp
	progress["level"] = level
	DataManager.save_progress(progress)
