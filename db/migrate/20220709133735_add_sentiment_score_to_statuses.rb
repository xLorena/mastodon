class AddSentimentScoreToStatuses < ActiveRecord::Migration[6.1]
  def change
    add_column :statuses, :sentiment_score, :float
  end
end
