class AddPolarizationScoreToStatuses < ActiveRecord::Migration[6.1]
  def change
    add_column :statuses, :polarization_score, :float
  end
end
