extends Node

var music_player: AudioStreamPlayer
var sfx_players: Array[AudioStreamPlayer] = []

const MAX_SFX_PLAYERS: int = 4

func _ready():
	music_player = AudioStreamPlayer.new()
	music_player.bus = "Master"
	add_child(music_player)

	for i in MAX_SFX_PLAYERS:
		var p := AudioStreamPlayer.new()
		p.bus = "Master"
		add_child(p)
		sfx_players.append(p)

func play_sfx(sfx_name: String) -> void:
	var path := "res://assets/audio/sfx/%s.wav" % sfx_name
	if not ResourceLoader.exists(path):
		push_warning("SFX not found: " + path)
		return
	var stream = load(path)
	for p in sfx_players:
		if not p.playing:
			p.stream = stream
			p.play()
			return

func play_sfx_stream(stream: AudioStream) -> void:
	for p in sfx_players:
		if not p.playing:
			p.stream = stream
			p.play()
			return

func play_music(track_name: String) -> void:
	var path := "res://assets/audio/music/%s.ogg" % track_name
	if not ResourceLoader.exists(path):
		push_warning("Music track not found: " + path)
		return
	if music_player.playing and music_player.stream == load(path):
		return
	music_player.stream = load(path)
	music_player.play()

func stop_music() -> void:
	music_player.stop()

func fade_out_music(duration: float = 1.0) -> void:
	if not music_player.playing:
		return
	var tween := create_tween()
	tween.tween_property(music_player, "volume_db", -40.0, duration)
	tween.tween_callback(music_player.stop)

func is_music_playing() -> bool:
	return music_player.playing
